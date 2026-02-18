import { ChatMessage, ParsedChat } from '../types/katalk';

// KakaoTalk export file patterns
// Pattern 1: [Name] [Time] Message
// Pattern 2: Name, [Time] Message
// Date pattern: --------------- 2024년 1월 15일 월요일 ---------------

const DATE_PATTERN = /^-+\s*(\d{4})년\s*(\d{1,2})월\s*(\d{1,2})일\s*[가-힣]+\s*-+$/;
const MESSAGE_PATTERN_1 = /^\[([^\]]+)\]\s*\[([^\]]+)\]\s*(.+)$/;
const MESSAGE_PATTERN_2 = /^([^,]+),\s*\[([^\]]+)\]\s*(.+)$/;
const TIME_PATTERN = /^(오전|오후)\s*(\d{1,2}):(\d{2})$/;

function parseTime(timeStr: string, currentDate: Date): Date {
  const match = timeStr.match(TIME_PATTERN);
  if (!match) return currentDate;

  const [, ampm, hourStr, minuteStr] = match;
  let hour = parseInt(hourStr, 10);
  const minute = parseInt(minuteStr, 10);

  if (ampm === '오후' && hour !== 12) {
    hour += 12;
  } else if (ampm === '오전' && hour === 12) {
    hour = 0;
  }

  const date = new Date(currentDate);
  date.setHours(hour, minute, 0, 0);
  return date;
}

function detectMessageType(content: string): ChatMessage['messageType'] {
  if (content.includes('사진') || content.includes('이미지')) return 'photo';
  if (content.includes('이모티콘')) return 'emoticon';
  if (content.match(/https?:\/\//)) return 'link';
  if (content.includes('파일:') || content.includes('동영상')) return 'file';
  if (content.includes('님이 들어왔습니다') || content.includes('님이 나갔습니다')) return 'system';
  return 'text';
}

export function parseKakaoTalkChat(content: string): ParsedChat {
  const lines = content.split('\n');
  const messages: ChatMessage[] = [];
  const participants = new Set<string>();
  let currentDate = new Date();
  let currentMessage: ChatMessage | null = null;

  for (const line of lines) {
    const trimmedLine = line.trim();
    if (!trimmedLine) continue;

    // Check for date line
    const dateMatch = trimmedLine.match(DATE_PATTERN);
    if (dateMatch) {
      const [, year, month, day] = dateMatch;
      currentDate = new Date(
        parseInt(year, 10),
        parseInt(month, 10) - 1,
        parseInt(day, 10)
      );
      continue;
    }

    // Try to match message patterns
    let messageMatch = trimmedLine.match(MESSAGE_PATTERN_1);
    if (!messageMatch) {
      messageMatch = trimmedLine.match(MESSAGE_PATTERN_2);
    }

    if (messageMatch) {
      // Save previous message if exists
      if (currentMessage) {
        messages.push(currentMessage);
      }

      const [, sender, time, messageContent] = messageMatch;
      const timestamp = parseTime(time, currentDate);
      const messageType = detectMessageType(messageContent);

      // Skip system messages for participant tracking
      if (messageType !== 'system') {
        participants.add(sender);
      }

      currentMessage = {
        sender,
        timestamp,
        content: messageContent,
        messageType,
      };
    } else if (currentMessage) {
      // Multi-line message continuation
      currentMessage.content += '\n' + trimmedLine;
    }
  }

  // Don't forget the last message
  if (currentMessage) {
    messages.push(currentMessage);
  }

  // Filter to only actual chat participants (exclude system)
  const actualParticipants = Array.from(participants).filter(
    (p) => messages.some((m) => m.sender === p && m.messageType !== 'system')
  );

  // Calculate message counts
  const messageCountBySender: Record<string, number> = {};
  for (const participant of actualParticipants) {
    messageCountBySender[participant] = messages.filter(
      (m) => m.sender === participant && m.messageType !== 'system'
    ).length;
  }

  // Determine date range
  const timestamps = messages.map((m) => m.timestamp.getTime());
  const dateRange = {
    start: new Date(Math.min(...timestamps)),
    end: new Date(Math.max(...timestamps)),
  };

  return {
    participants: actualParticipants,
    messages: messages.filter((m) => m.messageType !== 'system'),
    dateRange,
    totalMessageCount: messages.filter((m) => m.messageType !== 'system').length,
    messageCountBySender,
  };
}

// Sample messages for AI analysis (to reduce token usage)
export function sampleMessages(
  chat: ParsedChat,
  maxMessages: number = 200
): ChatMessage[] {
  const { messages } = chat;

  if (messages.length <= maxMessages) {
    return messages;
  }

  // Get evenly distributed samples
  const step = Math.floor(messages.length / maxMessages);
  const sampled: ChatMessage[] = [];

  for (let i = 0; i < messages.length && sampled.length < maxMessages; i += step) {
    sampled.push(messages[i]);
  }

  return sampled;
}

// Format messages for API request
export function formatMessagesForAPI(messages: ChatMessage[]): string {
  return messages
    .map((m) => `[${m.sender}] ${m.content}`)
    .join('\n');
}

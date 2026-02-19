import { ChatMessage, ParsedChat } from '../types/menhera';

// KakaoTalk export file patterns
// PC Pattern 1: [Name] [Time] Message
// PC Pattern 2: Name, [Time] Message
// PC Date pattern: --------------- 2024년 1월 15일 월요일 ---------------
// iOS Date pattern: 2025년 11월 9일 일요일
// iOS Message pattern: 2025. 11. 9. 22:07, 재혁 : 메시지
// Android Message pattern: 2025년 4월 19일 오전 12:41, 권창한 : 메시지

// PC patterns
const DATE_PATTERN = /^-+\s*(\d{4})년\s*(\d{1,2})월\s*(\d{1,2})일\s*[가-힣]+\s*-+$/;
const MESSAGE_PATTERN_1 = /^\[([^\]]+)\]\s*\[([^\]]+)\]\s*(.+)$/;
const MESSAGE_PATTERN_2 = /^([^,]+),\s*\[([^\]]+)\]\s*(.+)$/;
const TIME_PATTERN = /^(오전|오후)\s*(\d{1,2}):(\d{2})$/;

// iOS patterns
const IOS_DATE_PATTERN = /^(\d{4})년\s*(\d{1,2})월\s*(\d{1,2})일\s*[가-힣]+요일$/;
const IOS_MESSAGE_PATTERN = /^(\d{4})\.\s*(\d{1,2})\.\s*(\d{1,2})\.\s*(\d{1,2}):(\d{2}),\s*([^:]+?)\s*:\s*(.+)$/;

// Android patterns
const ANDROID_MESSAGE_PATTERN = /^(\d{4})년\s*(\d{1,2})월\s*(\d{1,2})일\s*(오전|오후)\s*(\d{1,2}):(\d{2}),\s*([^:]+?)\s*:\s*(.+)$/;

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

function parseIosTimestamp(year: string, month: string, day: string, hour: string, minute: string): Date {
  return new Date(
    parseInt(year, 10),
    parseInt(month, 10) - 1,
    parseInt(day, 10),
    parseInt(hour, 10),
    parseInt(minute, 10)
  );
}

function parseAndroidTimestamp(year: string, month: string, day: string, ampm: string, hour: string, minute: string): Date {
  let h = parseInt(hour, 10);
  if (ampm === '오후' && h !== 12) {
    h += 12;
  } else if (ampm === '오전' && h === 12) {
    h = 0;
  }
  return new Date(
    parseInt(year, 10),
    parseInt(month, 10) - 1,
    parseInt(day, 10),
    h,
    parseInt(minute, 10)
  );
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

    // Check for PC date line (with dashes)
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

    // Check for iOS date line (without dashes)
    const iosDateMatch = trimmedLine.match(IOS_DATE_PATTERN);
    if (iosDateMatch) {
      const [, year, month, day] = iosDateMatch;
      currentDate = new Date(
        parseInt(year, 10),
        parseInt(month, 10) - 1,
        parseInt(day, 10)
      );
      continue;
    }

    // Try Android message pattern first (has full datetime in message)
    const androidMatch = trimmedLine.match(ANDROID_MESSAGE_PATTERN);
    if (androidMatch) {
      if (currentMessage) {
        messages.push(currentMessage);
      }

      const [, year, month, day, ampm, hour, minute, sender, messageContent] = androidMatch;
      const timestamp = parseAndroidTimestamp(year, month, day, ampm, hour, minute);
      const messageType = detectMessageType(messageContent);

      if (messageType !== 'system') {
        participants.add(sender.trim());
      }

      currentMessage = {
        sender: sender.trim(),
        timestamp,
        content: messageContent,
        messageType,
      };
      continue;
    }

    // Try iOS message pattern (has full datetime in message)
    const iosMatch = trimmedLine.match(IOS_MESSAGE_PATTERN);
    if (iosMatch) {
      if (currentMessage) {
        messages.push(currentMessage);
      }

      const [, year, month, day, hour, minute, sender, messageContent] = iosMatch;
      const timestamp = parseIosTimestamp(year, month, day, hour, minute);
      const messageType = detectMessageType(messageContent);

      if (messageType !== 'system') {
        participants.add(sender.trim());
      }

      currentMessage = {
        sender: sender.trim(),
        timestamp,
        content: messageContent,
        messageType,
      };
      continue;
    }

    // Try PC message patterns
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
  maxMessages: number = 300
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

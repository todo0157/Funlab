import { ParsedChat, Message, ParticipantStats } from '../types/greenlight';

// PC KakaoTalk pattern: [Name] [HH:MM] Message
const PC_MESSAGE_PATTERN = /^\[([^\]]+)\] \[([^\]]+)\] (.+)$/;

// iOS KakaoTalk pattern: YYYY. M. D. 오전/오후 H:MM, Name : Message
const IOS_MESSAGE_PATTERN = /^(\d{4}\. \d{1,2}\. \d{1,2}\. 오[전후] \d{1,2}:\d{2}), ([^:]+) : (.+)$/;

// Android KakaoTalk pattern: YYYY년 M월 D일 오전/오후 H:MM, Name : Message
const ANDROID_MESSAGE_PATTERN = /^(\d{4}년 \d{1,2}월 \d{1,2}일 오[전후] \d{1,2}:\d{2}), ([^:]+) : (.+)$/;

// Date line patterns
const DATE_LINE_PATTERNS = [
  /^-+ \d{4}년 \d{1,2}월 \d{1,2}일 .+요일 -+$/,
  /^-+ \d{4}\. \d{1,2}\. \d{1,2}\. .+요일 -+$/,
  /^\d{4}년 \d{1,2}월 \d{1,2}일 .+요일$/,
];

// System message patterns to skip
const SYSTEM_MESSAGE_PATTERNS = [
  /^.*님이 들어왔습니다\.?$/,
  /^.*님이 나갔습니다\.?$/,
  /^.*님을 초대했습니다\.?$/,
  /^사진$/,
  /^동영상$/,
  /^파일:/,
  /^이모티콘$/,
  /^삭제된 메시지입니다\.?$/,
];

function isSystemMessage(content: string): boolean {
  return SYSTEM_MESSAGE_PATTERNS.some(pattern => pattern.test(content.trim()));
}

function isDateLine(line: string): boolean {
  return DATE_LINE_PATTERNS.some(pattern => pattern.test(line.trim()));
}

function parseTime(timeStr: string): { hour: number; minute: number } {
  // Handle 오전/오후 format
  const isAfternoon = timeStr.includes('오후');
  const timeMatch = timeStr.match(/(\d{1,2}):(\d{2})/);

  if (timeMatch) {
    let hour = parseInt(timeMatch[1], 10);
    const minute = parseInt(timeMatch[2], 10);

    if (isAfternoon && hour !== 12) {
      hour += 12;
    } else if (!isAfternoon && hour === 12) {
      hour = 0;
    }

    return { hour, minute };
  }

  return { hour: 12, minute: 0 };
}

function parseLine(line: string, currentDate: Date): { sender: string; content: string; timestamp: Date; hour: number } | null {
  // Try PC format
  const pcMatch = line.match(PC_MESSAGE_PATTERN);
  if (pcMatch) {
    const [, sender, timeStr, content] = pcMatch;
    if (isSystemMessage(content)) return null;

    const { hour, minute } = parseTime(timeStr);
    const timestamp = new Date(currentDate);
    timestamp.setHours(hour, minute, 0, 0);

    return { sender: sender.trim(), content: content.trim(), timestamp, hour };
  }

  // Try iOS format
  const iosMatch = line.match(IOS_MESSAGE_PATTERN);
  if (iosMatch) {
    const [, dateTimeStr, sender, content] = iosMatch;
    if (isSystemMessage(content)) return null;

    const { hour, minute } = parseTime(dateTimeStr);
    const timestamp = new Date(currentDate);
    timestamp.setHours(hour, minute, 0, 0);

    return { sender: sender.trim(), content: content.trim(), timestamp, hour };
  }

  // Try Android format
  const androidMatch = line.match(ANDROID_MESSAGE_PATTERN);
  if (androidMatch) {
    const [, dateTimeStr, sender, content] = androidMatch;
    if (isSystemMessage(content)) return null;

    const { hour, minute } = parseTime(dateTimeStr);
    const timestamp = new Date(currentDate);
    timestamp.setHours(hour, minute, 0, 0);

    return { sender: sender.trim(), content: content.trim(), timestamp, hour };
  }

  return null;
}

function calculateParticipantStats(messages: Message[], participant: string): ParticipantStats {
  const participantMessages = messages.filter(m => m.sender === participant);

  const messageCount = participantMessages.length;

  // Short reply rate (messages with 5 or fewer characters)
  const shortReplies = participantMessages.filter(m => m.content.length <= 5).length;
  const shortReplyRate = messageCount > 0 ? shortReplies / messageCount : 0;

  // Emoji rate
  const emojiPattern = /[\u{1F300}-\u{1F9FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]|ㅋ{2,}|ㅎ{2,}|ㅠ{2,}|ㅜ{2,}/gu;
  const messagesWithEmoji = participantMessages.filter(m => emojiPattern.test(m.content)).length;
  const emojiRate = messageCount > 0 ? messagesWithEmoji / messageCount : 0;

  // Question rate
  const questionMessages = participantMessages.filter(m => m.content.includes('?')).length;
  const questionRate = messageCount > 0 ? questionMessages / messageCount : 0;

  // Late night rate (11pm - 4am)
  const lateNightMessages = participantMessages.filter(m => m.hour >= 23 || m.hour < 4).length;
  const lateNightRate = messageCount > 0 ? lateNightMessages / messageCount : 0;

  // Initiation rate (who starts conversations - simplified)
  let initiations = 0;
  let gapCount = 0;

  for (let i = 0; i < messages.length; i++) {
    const msg = messages[i];
    if (i > 0) {
      const prevMsg = messages[i - 1];
      const gap = msg.timestamp.getTime() - prevMsg.timestamp.getTime();
      // Consider 2+ hour gap as new conversation
      if (gap > 2 * 60 * 60 * 1000) {
        gapCount++;
        if (msg.sender === participant) {
          initiations++;
        }
      }
    }
  }

  const initiationRate = gapCount > 0 ? initiations / gapCount : 0.5;

  // Average response time
  let totalResponseTime = 0;
  let responseCount = 0;

  for (let i = 1; i < messages.length; i++) {
    if (messages[i].sender === participant && messages[i - 1].sender !== participant) {
      const gap = messages[i].timestamp.getTime() - messages[i - 1].timestamp.getTime();
      if (gap < 24 * 60 * 60 * 1000) { // Only count if within 24 hours
        totalResponseTime += gap;
        responseCount++;
      }
    }
  }

  const avgResponseTime = responseCount > 0 ? totalResponseTime / responseCount / 60000 : 0; // in minutes

  return {
    name: participant,
    messageCount,
    avgResponseTime,
    shortReplyRate,
    initiationRate,
    emojiRate,
    questionRate,
    lateNightRate,
  };
}

export function parseKakaoTalkChat(content: string): ParsedChat {
  const lines = content.split('\n');
  const messages: Message[] = [];
  const participantsSet = new Set<string>();
  let currentDate = new Date();

  for (const line of lines) {
    const trimmedLine = line.trim();
    if (!trimmedLine) continue;

    // Check for date line
    if (isDateLine(trimmedLine)) {
      const dateMatch = trimmedLine.match(/(\d{4})[년.]\s*(\d{1,2})[월.]\s*(\d{1,2})/);
      if (dateMatch) {
        currentDate = new Date(
          parseInt(dateMatch[1]),
          parseInt(dateMatch[2]) - 1,
          parseInt(dateMatch[3])
        );
      }
      continue;
    }

    const parsed = parseLine(trimmedLine, currentDate);
    if (parsed) {
      messages.push(parsed);
      participantsSet.add(parsed.sender);
    }
  }

  const participants = Array.from(participantsSet);
  const participantStats = new Map<string, ParticipantStats>();

  for (const participant of participants) {
    participantStats.set(participant, calculateParticipantStats(messages, participant));
  }

  return {
    participants,
    messages,
    totalMessageCount: messages.length,
    participantStats,
  };
}

export function prepareAnalysisData(
  parsedChat: ParsedChat,
  targetName: string,
  tier: 'free' | 'premium'
): { messages: string; stats: ParticipantStats | undefined } {
  const maxMessages = tier === 'premium' ? 3000 : 500;

  // Get recent messages
  const recentMessages = parsedChat.messages.slice(-maxMessages);

  // Format messages for analysis
  const formattedMessages = recentMessages
    .map(m => `[${m.sender}] ${m.content}`)
    .join('\n');

  const stats = parsedChat.participantStats.get(targetName);

  return { messages: formattedMessages, stats };
}

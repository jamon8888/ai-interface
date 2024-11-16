type AllowedTools =
  | 'createDocument'
  | 'updateDocument'
  | 'requestSuggestions'
  | 'getWeather';

export const blocksTools: AllowedTools[] = [
  'createDocument',
  'updateDocument',
  'requestSuggestions',
  'testTool'
];

export const weatherTools: AllowedTools[] = [
  'getWeather'
];

export const allTools: AllowedTools[] = [
  'getWeather',
  'createDocument',
  'updateDocument',
  'requestSuggestions',
  'testTool'
];
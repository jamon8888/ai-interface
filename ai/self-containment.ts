export async function isSelfContained(userMessage, coreMessages = [], language = 'en', approach = 'simplistic') {
  const message = userMessage.content
  
  if (approach == 'simplistic') {
    return message.endsWith('?') || message.length > 50;
  }

  let score = 0;
  let threshold = 6;
  let priorMessages = coreMessages.map(msg => msg.content).pop();

  score += dependencyAnalysis(message);
  score += dependencyParsing(message);
  score += referenceResolution(message);
  score += await semanticSimilarity(message, priorMessages);
  score += logicalCompleteness(message);
  score += punctuationAndStructure(message);
  score += temporalDependency(message);
  score += sentimentShift(message, priorMessages);
  score += topicSimilarity(message, priorMessages);

  return score >= threshold; // Threshold for determining self-containment
}

function dependencyAnalysis(message, language = 'en') {
  const weight = 1;
  let dependentKeywords = {
    en: ['this', 'that', 'it', 'as mentioned', 'earlier', 'continuing', 'further'],
    // Add other languages here
  };

  dependentKeywords = dependentKeywords[language] || [];
  return !dependentKeywords.some(keyword => message.toLowerCase().includes(keyword)) ? weight : 0;
}

function dependencyParsing(message, language = 'en') {
  const weight = 1;
  return parseSentenceStructure(message, language) ? weight : 0;
}

function referenceResolution(message, language = 'en') {
  const weight = 1;
  let unresolvedReferences = {
    en: ['this', 'that', 'these', 'those', 'it'],
    // Add other languages here
  };

  unresolvedReferences = unresolvedReferences[language] || [];
  const words = message.toLowerCase().split(/\s+/);
  return !words.some(word => unresolvedReferences.includes(word)) ? weight : 0;
}

async function semanticSimilarity(message, priorMessages = [], language = 'en') {
  const weight = 1;
  const similarity = await calculateSemanticSimilarity(message, priorMessages.join(' '), language); // Add language parameter
  return similarity < 0.5 ? weight : 0;
}

function logicalCompleteness(message, language = 'en') {
  const weight = 1;
  let questionWords = {
    en: ['what', 'why', 'how', 'when', 'where'],
    // Add other languages here
  };

  questionWords = questionWords[language] || [];
  const hasQuestionWord = questionWords.some(word => message.toLowerCase().startsWith(word));
  const hasClearIntent = message.includes('?') || message.includes('please');
  return hasQuestionWord && hasClearIntent ? weight : 0;
}

function punctuationAndStructure(message, language = 'en') {
  const weight = 1;
  let dependentPunctuation = {
    en: ['...', '--', '(', ')'],
    // Add other languages here
  };

  dependentPunctuation = dependentPunctuation[language] || [];
  return !dependentPunctuation.some(punct => message.includes(punct)) ? weight : 0;
}

function temporalDependency(message, language = 'en') {
  const weight = 1;
  let temporalKeywords = {
    en: ['later', 'yesterday', 'soon', 'tomorrow', 'earlier'],
    // Add other languages here
  };

  temporalKeywords = temporalKeywords[language] || [];
  return !temporalKeywords.some(word => message.toLowerCase().includes(word)) ? weight : 0;
}

function sentimentShift(message, priorMessages = [], language = 'en') {
  const weight = 1;
  const currentSentiment = analyzeSentiment(message, language);
  const previousSentiment = analyzeSentiment(priorMessages.join(' '), language);
  const sentimentDifference = Math.abs(currentSentiment - previousSentiment);

  return sentimentDifference < 0.5 ? weight : 0;
}

function topicSimilarity(message, priorMessages = [], language = 'en') {
  const weight = 1;
  const currentTopic = extractTopic(message, language);
  const priorTopic = extractTopic(priorMessages.join(' '), language);

  return currentTopic !== priorTopic ? weight : 0;
}

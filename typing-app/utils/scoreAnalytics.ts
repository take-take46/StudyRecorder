import { ScoreRecord, Subject, ScoreChartData } from '@/types/score';

export const calculateYearlyTotals = (scores: ScoreRecord[]): { year: number; total: number; average: number; count: number }[] => {
  const yearGroups = scores.reduce((acc, score) => {
    if (!acc[score.year]) {
      acc[score.year] = [];
    }
    acc[score.year].push(score);
    return acc;
  }, {} as Record<number, ScoreRecord[]>);

  return Object.entries(yearGroups).map(([year, yearScores]) => {
    const total = yearScores.reduce((sum, score) => sum + score.score, 0);
    const average = total / yearScores.length;
    return {
      year: parseInt(year),
      total,
      average: Math.round(average * 10) / 10,
      count: yearScores.length
    };
  }).sort((a, b) => a.year - b.year);
};

export const calculateSubjectAverages = (scores: ScoreRecord[]): { subject: Subject; average: number; count: number; latest: number }[] => {
  const subjectGroups: Record<string, ScoreRecord[]> = {};
  
  scores.forEach(score => {
    if (!subjectGroups[score.subject]) {
      subjectGroups[score.subject] = [];
    }
    subjectGroups[score.subject].push(score);
  });

  return Object.entries(subjectGroups).map(([subject, subjectScores]) => {
    const sortedScores = subjectScores.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    const total = subjectScores.reduce((sum, score) => sum + score.score, 0);
    const average = total / subjectScores.length;
    return {
      subject: subject as Subject,
      average: Math.round(average * 10) / 10,
      count: subjectScores.length,
      latest: sortedScores[0]?.score || 0
    };
  }).sort((a, b) => b.average - a.average);
};

export const getScoreChartData = (scores: ScoreRecord[]): ScoreChartData[] => {
  return scores.map(score => ({
    year: score.year,
    subject: score.subject,
    score: score.score
  }));
};

export const getYearlySubjectData = (scores: ScoreRecord[], year: number, filterSubject?: Subject) => {
  let yearScores = scores.filter(score => score.year === year);
  
  if (filterSubject) {
    yearScores = yearScores.filter(score => score.subject === filterSubject);
  }

  const subjectData = yearScores.reduce((acc, score) => {
    if (!acc[score.subject]) {
      acc[score.subject] = [];
    }
    acc[score.subject].push({
      score: score.score,
      date: score.date,
      id: score.id
    });
    return acc;
  }, {} as Record<string, Array<{score: number; date: string; id: string}>>);

  return Object.entries(subjectData).map(([subject, scoreData]) => ({
    subject,
    scores: scoreData.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
    count: scoreData.length
  }));
};

export const getProgressData = (scores: ScoreRecord[], subject?: Subject) => {
  let filteredScores = scores;
  if (subject) {
    filteredScores = scores.filter(score => score.subject === subject);
  }

  return filteredScores
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .map((score, index) => ({
      ...score,
      index: index + 1,
      date: score.date
    }));
};

export const getScoreStats = (scores: ScoreRecord[]) => {
  if (scores.length === 0) {
    return {
      totalTests: 0,
      averageScore: 0,
      highestScore: 0,
      lowestScore: 0,
      passRate: 0
    };
  }

  const totalScore = scores.reduce((sum, score) => sum + score.score, 0);
  const passCount = scores.filter(score => score.score >= 60).length;

  return {
    totalTests: scores.length,
    averageScore: Math.round((totalScore / scores.length) * 10) / 10,
    highestScore: Math.max(...scores.map(s => s.score)),
    lowestScore: Math.min(...scores.map(s => s.score)),
    passRate: Math.round((passCount / scores.length) * 100)
  };
};

export const getYearlySubjectDistribution = (scores: ScoreRecord[], year: number) => {
  const yearScores = scores.filter(score => score.year === year);
  const subjectData = yearScores.reduce((acc, score) => {
    if (!acc[score.subject]) {
      acc[score.subject] = [];
    }
    acc[score.subject].push(score.score);
    return acc;
  }, {} as Record<string, number[]>);

  const totalScore = Object.values(subjectData).reduce((sum, scores) => {
    return sum + (scores.length > 0 ? Math.max(...scores) : 0);
  }, 0);

  const isPass = totalScore >= 360;

  return {
    subjects: Object.entries(subjectData).map(([subject, scores]) => ({
      subject,
      score: scores.length > 0 ? Math.max(...scores) : 0,
      count: scores.length
    })),
    totalScore,
    isPass,
    passStatus: isPass ? '合格' : '不合格'
  };
};

export const getSubjectYearlyComparison = (scores: ScoreRecord[], subject: Subject) => {
  const subjectScores = scores.filter(score => score.subject === subject);
  const yearGroups = subjectScores.reduce((acc, score) => {
    if (!acc[score.year]) {
      acc[score.year] = [];
    }
    acc[score.year].push(score.score);
    return acc;
  }, {} as Record<number, number[]>);

  return Object.entries(yearGroups)
    .map(([year, scores]) => ({
      year: parseInt(year),
      score: Math.max(...scores),
      average: Math.round((scores.reduce((a, b) => a + b, 0) / scores.length) * 10) / 10,
      count: scores.length,
      allScores: scores.sort((a, b) => b - a)
    }))
    .sort((a, b) => a.year - b.year);
};

export const getComprehensiveResults = (scores: ScoreRecord[]) => {
  const years = Array.from(new Set(scores.map(score => score.year))).sort((a, b) => b - a);
  
  return years.map(year => {
    const yearScores = scores.filter(score => score.year === year);
    const subjectData: Record<Subject, number> = {} as Record<Subject, number>;
    
    // 各科目の最高点を取得
    yearScores.forEach(score => {
      if (!subjectData[score.subject] || subjectData[score.subject] < score.score) {
        subjectData[score.subject] = score.score;
      }
    });
    
    const totalScore = Object.values(subjectData).reduce((sum, score) => sum + score, 0);
    const isPass = totalScore >= 360;
    
    return {
      year,
      subjects: subjectData,
      totalScore,
      isPass,
      passStatus: isPass ? '合格' : '不合格',
      subjectCount: Object.keys(subjectData).length
    };
  });
};
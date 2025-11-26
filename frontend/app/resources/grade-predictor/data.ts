export type ComponentId =
    | 'gaa' | 'quiz1' | 'quiz2' | 'endTerm' | 'bonus'
    | 'gp1' | 'gp2' | 'pp' | 'cp'
    | 'grpa' | 'oppe' | 'oppe1' | 'oppe2'
    | 'roe' | 'project1' | 'project2'
    | 'gla' | 'bpta'
    | 'gaa_sql' | 'gaa_prog' | 'gaa_obj'
    | 'vmt' | 'nppe' | 'le' | 'lv' | 'd' | 'we' | 'id';

export type DegreeType = 'BS_DS' | 'BS_ES';

export interface GradeComponent {
    id: ComponentId;
    label: string;
    maxScore: number;
    description?: string;
}

export interface GradingSchema {
    components: ComponentId[];
    calculateScore: (scores: Record<ComponentId, number>) => number;
}

export interface Subject {
    id: string;
    name: string;
    level: 'Foundation' | 'Diploma' | 'Degree';
    degreeType: DegreeType;
    schema: GradingSchema;
}

export const COMPONENTS: Record<ComponentId, GradeComponent> = {
    gaa: { id: 'gaa', label: 'Graded Assignments (GAA)', maxScore: 100, description: 'Average of best assignments' },
    quiz1: { id: 'quiz1', label: 'Quiz 1', maxScore: 100 },
    quiz2: { id: 'quiz2', label: 'Quiz 2', maxScore: 100 },
    endTerm: { id: 'endTerm', label: 'End Term Exam', maxScore: 100 },
    bonus: { id: 'bonus', label: 'Bonus Marks', maxScore: 5, description: 'Mock tests, active participation, etc.' },
    gp1: { id: 'gp1', label: 'Group Project Milestone 1-3', maxScore: 100 },
    gp2: { id: 'gp2', label: 'Group Project Milestone 4-6', maxScore: 100 },
    pp: { id: 'pp', label: 'Project Presentation', maxScore: 100 },
    cp: { id: 'cp', label: 'Course Participation', maxScore: 100 },
    grpa: { id: 'grpa', label: 'Group Programming Assignments (GrPA)', maxScore: 100 },
    oppe: { id: 'oppe', label: 'OPPE', maxScore: 100, description: 'Online Programming Proficiency Exam' },
    oppe1: { id: 'oppe1', label: 'OPPE 1', maxScore: 100 },
    oppe2: { id: 'oppe2', label: 'OPPE 2', maxScore: 100 },
    roe: { id: 'roe', label: 'Remote Online Exam (ROE)', maxScore: 100 },
    project1: { id: 'project1', label: 'Project 1', maxScore: 100 },
    project2: { id: 'project2', label: 'Project 2', maxScore: 100 },
    gla: { id: 'gla', label: 'Graded Lab Assignments (GLA)', maxScore: 100 },
    bpta: { id: 'bpta', label: 'Biweekly Programming Test Avg (BPTA)', maxScore: 100 },
    gaa_sql: { id: 'gaa_sql', label: 'SQL Assignments (GAA2)', maxScore: 100 },
    gaa_prog: { id: 'gaa_prog', label: 'Programming Assignment (GAA3)', maxScore: 100 },
    gaa_obj: { id: 'gaa_obj', label: 'Objective Assignments (GAA1)', maxScore: 100 },
    vmt: { id: 'vmt', label: 'Virtual Machine Tasks (VMT)', maxScore: 100 },
    nppe: { id: 'nppe', label: 'NPPE', maxScore: 100 },
    le: { id: 'le', label: 'Lab Experiment', maxScore: 100 },
    lv: { id: 'lv', label: 'Lab Viva', maxScore: 100 },
    d: { id: 'd', label: 'Design Assignment', maxScore: 100 },
    we: { id: 'we', label: 'Weekly Experiment', maxScore: 100 },
    id: { id: 'id', label: 'In-Person Demonstration', maxScore: 100 },
};


// --- FORMULAS ---

// Standard Foundation: T = 0.1GAA + max(0.6F + 0.2max(Qz1, Qz2), 0.4F + 0.2Qz1 + 0.3Qz2)
const standardFoundationFormula = (scores: Record<ComponentId, number>) => {
    const gaa = scores.gaa || 0;
    const qz1 = scores.quiz1 || 0;
    const qz2 = scores.quiz2 || 0;
    const f = scores.endTerm || 0;
    const bonus = scores.bonus || 0;

    const term1 = 0.6 * f + 0.2 * Math.max(qz1, qz2);
    const term2 = 0.4 * f + 0.2 * qz1 + 0.3 * qz2;

    let total = 0.1 * gaa + Math.max(term1, term2);
    total += bonus;
    return Math.min(100, total);
};

// Python: T = 0.1 GAA1 + 0.1 GAA2 + 0.1 Qz1 + 0.4 F + 0.25 max(PE1, PE2) + 0.15 min(PE1, PE2)
const pythonFormula = (scores: Record<ComponentId, number>) => {
    const gaa1 = scores.gaa || 0; // Objective
    const gaa2 = scores.grpa || 0; // Programming
    const qz1 = scores.quiz1 || 0;
    const f = scores.endTerm || 0;
    const pe1 = scores.oppe1 || 0;
    const pe2 = scores.oppe2 || 0;
    const bonus = scores.bonus || 0;

    let total = 0.1 * gaa1 + 0.1 * gaa2 + 0.1 * qz1 + 0.4 * f + 0.25 * Math.max(pe1, pe2) + 0.15 * Math.min(pe1, pe2);
    total += bonus;
    return Math.min(100, total);
};

// Tools in DS: T = 0.2 GAA + 0.2 ROE + 0.2 P1 + 0.2 P2 + 0.2 F
const toolsFormula = (scores: Record<ComponentId, number>) => {
    const gaa = scores.gaa || 0;
    const roe = scores.roe || 0;
    const p1 = scores.project1 || 0;
    const p2 = scores.project2 || 0;
    const f = scores.endTerm || 0;
    const bonus = scores.bonus || 0;

    let total = 0.2 * gaa + 0.2 * roe + 0.2 * p1 + 0.2 * p2 + 0.2 * f;
    total += bonus;
    return Math.min(100, total);
};

// PDSA: T = 0.1GAA + 0.4F + 0.2OP + max(0.2max(Qz1, Qz2), 0.15Qz1+0.15Qz2)
const pdsaFormula = (scores: Record<ComponentId, number>) => {
    const gaa = scores.gaa || 0;
    const f = scores.endTerm || 0;
    const op = scores.oppe || 0;
    const qz1 = scores.quiz1 || 0;
    const qz2 = scores.quiz2 || 0;
    const bonus = scores.bonus || 0;

    const quizTerm = Math.max(0.2 * Math.max(qz1, qz2), 0.15 * qz1 + 0.15 * qz2);
    let total = 0.1 * gaa + 0.4 * f + 0.2 * op + quizTerm;
    total += bonus;
    return Math.min(100, total);
};

// DBMS: T = 0.04GAA1 + 0.03GAA2 + 0.03GAA3 + 0.2OP + max (0.45F+0.15max(Qz1, Qz2), 0.4F+(0.10Qz1+0.20Qz2 ))
const dbmsFormula = (scores: Record<ComponentId, number>) => {
    const gaa1 = scores.gaa || 0;
    const gaa2 = scores.gaa_sql || 0;
    const gaa3 = scores.gaa_prog || 0;
    const op = scores.oppe || 0;
    const f = scores.endTerm || 0;
    const qz1 = scores.quiz1 || 0;
    const qz2 = scores.quiz2 || 0;
    const bonus = scores.bonus || 0;

    const examTerm = Math.max(0.45 * f + 0.15 * Math.max(qz1, qz2), 0.4 * f + 0.10 * qz1 + 0.20 * qz2);
    let total = 0.04 * gaa1 + 0.03 * gaa2 + 0.03 * gaa3 + 0.2 * op + examTerm;
    total += bonus;
    return Math.min(100, total);
};

// AppDev 1: T = 0.15 GLA + 0.05 GA + Max(0.35 F + 0.2 Qz1 + 0.25 Qz2, 0.4 F + 0.3 Best(Qz1,Qz2))
const appDev1Formula = (scores: Record<ComponentId, number>) => {
    const gla = scores.gla || 0;
    const ga = scores.gaa || 0;
    const f = scores.endTerm || 0;
    const qz1 = scores.quiz1 || 0;
    const qz2 = scores.quiz2 || 0;
    const bonus = scores.bonus || 0;

    const examTerm = Math.max(0.35 * f + 0.2 * qz1 + 0.25 * qz2, 0.4 * f + 0.3 * Math.max(qz1, qz2));
    let total = 0.15 * gla + 0.05 * ga + examTerm;
    total += bonus;
    return Math.min(100, total);
};

// System Commands: T = 0.10 GAA + 0.2 Qz1 + 0.3 OPE + 0.3 F + 0.1 BPTA
const systemCommandsFormula = (scores: Record<ComponentId, number>) => {
    const gaa = scores.gaa || 0;
    const qz1 = scores.quiz1 || 0;
    const ope = scores.oppe || 0;
    const f = scores.endTerm || 0;
    const bpta = scores.bpta || 0;
    const bonus = scores.bonus || 0;

    let total = 0.10 * gaa + 0.2 * qz1 + 0.3 * ope + 0.3 * f + 0.1 * bpta;
    total += bonus;
    return Math.min(100, total);
};

// AppDev 2: T = 0.05 GAA1 + 0.05 GAA2 + Max(0.35F + 0.25 Qz1 + 0.3 Qz2, 0.5F + 0.3 Best(Qz1, Qz2))
const appDev2Formula = (scores: Record<ComponentId, number>) => {
    const gaa1 = scores.gaa_obj || 0;
    const gaa2 = scores.gaa_prog || 0;
    const f = scores.endTerm || 0;
    const qz1 = scores.quiz1 || 0;
    const qz2 = scores.quiz2 || 0;
    const bonus = scores.bonus || 0;

    const examTerm = Math.max(0.35 * f + 0.25 * qz1 + 0.3 * qz2, 0.5 * f + 0.3 * Math.max(qz1, qz2));
    let total = 0.05 * gaa1 + 0.05 * gaa2 + examTerm;
    total += bonus;
    return Math.min(100, total);
};

// MLT: T = 0.1 GAA + 0.4F + Max(0.25 Qz1 + 0.25 Qz2, 0.4max(Qz1,Qz2))
const mltFormula = (scores: Record<ComponentId, number>) => {
    const gaa = scores.gaa || 0;
    const qz1 = scores.quiz1 || 0;
    const qz2 = scores.quiz2 || 0;
    const f = scores.endTerm || 0;
    const bonus = scores.bonus || 0;

    const term = Math.max(0.25 * qz1 + 0.25 * qz2, 0.4 * Math.max(qz1, qz2));
    let total = 0.1 * gaa + 0.4 * f + term;
    total += bonus;
    return Math.min(100, total);
};

// Helper for Degree Standard: T = 0.1GAA + 0.4F + 0.25Qz1 + 0.25Qz2
const degreeStandardFormula = (scores: Record<ComponentId, number>) => {
    const gaa = scores.gaa || 0;
    const qz1 = scores.quiz1 || 0;
    const qz2 = scores.quiz2 || 0;
    const f = scores.endTerm || 0;
    const bonus = scores.bonus || 0;

    let total = 0.1 * gaa + 0.4 * f + 0.25 * qz1 + 0.25 * qz2;
    total += bonus;
    return Math.min(100, total);
}

// --- ES FORMULAS ---

// Linux: T = 0.1 GAA + 0.05 NPPE + 0.2 Qz1 + 0.25 OPE + 0.3 F + 0.05 BPTA + 0.05 VMT
const linuxFormula = (scores: Record<ComponentId, number>) => {
    const gaa = scores.gaa || 0;
    const nppe = scores.nppe || 0;
    const qz1 = scores.quiz1 || 0;
    const ope = scores.oppe || 0;
    const f = scores.endTerm || 0;
    const bpta = scores.bpta || 0;
    const vmt = scores.vmt || 0;
    const bonus = scores.bonus || 0;

    let total = 0.1 * gaa + 0.05 * nppe + 0.2 * qz1 + 0.25 * ope + 0.3 * f + 0.05 * bpta + 0.05 * vmt;
    total += bonus;
    return Math.min(100, total);
};

// Lab: T = 0.5 (TLA/OL) + 0.5 (IL)
const labFormula = (scores: Record<ComponentId, number>) => {
    // Using 'gla' for TLA/OL as it's a generic lab assignment score
    const tla = scores.gla || 0;
    const il = scores.id || 0; // In-person Demonstration

    let total = 0.5 * tla + 0.5 * il;
    return Math.min(100, total);
};

// Electronics Lab: T = 0.4 (WE) + 0.6 (ID)
const electronicsLabFormula = (scores: Record<ComponentId, number>) => {
    const we = scores.we || 0;
    const id = scores.id || 0;

    let total = 0.4 * we + 0.6 * id;
    return Math.min(100, total);
};

// Embedded C: T = 0.1GAA + 0.1 GRPA + max ((0.5F + 0.2max(Qz1, Qz2)), (0.4F + 0.2Qz1 + 0.2Qz2))
const embeddedCFormula = (scores: Record<ComponentId, number>) => {
    const gaa = scores.gaa || 0;
    const grpa = scores.grpa || 0;
    const qz1 = scores.quiz1 || 0;
    const qz2 = scores.quiz2 || 0;
    const f = scores.endTerm || 0;
    const bonus = scores.bonus || 0;

    const term = Math.max(0.5 * f + 0.2 * Math.max(qz1, qz2), 0.4 * f + 0.2 * qz1 + 0.2 * qz2);
    let total = 0.1 * gaa + 0.1 * grpa + term;
    total += bonus;
    return Math.min(100, total);
};

// Embedded C Lab: T = 0.2(Attendance) + 0.8(Lab experiment and Viva)
// Assuming 'cp' for Attendance and 'le' for Lab Experiment/Viva
const embeddedCLabFormula = (scores: Record<ComponentId, number>) => {
    const attendance = scores.cp || 0;
    const lab = scores.le || 0;

    let total = 0.2 * attendance + 0.8 * lab;
    return Math.min(100, total);
};

// Signals & Systems: T = 0.1GAA + max (0.5F + 0.2max(Qz1, Qz2), 0.4F + 0.2Qz1 + 0.2Qz2) + 0.1 GrPA
const signalsFormula = (scores: Record<ComponentId, number>) => {
    const gaa = scores.gaa || 0;
    const qz1 = scores.quiz1 || 0;
    const qz2 = scores.quiz2 || 0;
    const f = scores.endTerm || 0;
    const grpa = scores.grpa || 0;
    const bonus = scores.bonus || 0;

    const term = Math.max(0.5 * f + 0.2 * Math.max(qz1, qz2), 0.4 * f + 0.2 * qz1 + 0.2 * qz2);
    let total = 0.1 * gaa + term + 0.1 * grpa;
    total += bonus;
    return Math.min(100, total);
};

// DSP: T = 0.1GAA + 0.1LE + 0.05LV + max (0.55F + 0.1max(Qz1, Qz2), 0.45F + 0.15Qz1 + 0.15Qz2)
const dspFormula = (scores: Record<ComponentId, number>) => {
    const gaa = scores.gaa || 0;
    const le = scores.le || 0;
    const lv = scores.lv || 0;
    const qz1 = scores.quiz1 || 0;
    const qz2 = scores.quiz2 || 0;
    const f = scores.endTerm || 0;
    const bonus = scores.bonus || 0;

    const term = Math.max(0.55 * f + 0.1 * Math.max(qz1, qz2), 0.45 * f + 0.15 * qz1 + 0.15 * qz2);
    let total = 0.1 * gaa + 0.1 * le + 0.05 * lv + term;
    total += bonus;
    return Math.min(100, total);
};

// Control Engineering: T = 0.1GAA + 0.45F + 0.2Qz1 + 0.2Qz2 + 0.05 D
const controlFormula = (scores: Record<ComponentId, number>) => {
    const gaa = scores.gaa || 0;
    const f = scores.endTerm || 0;
    const qz1 = scores.quiz1 || 0;
    const qz2 = scores.quiz2 || 0;
    const d = scores.d || 0;
    const bonus = scores.bonus || 0;

    let total = 0.1 * gaa + 0.45 * f + 0.2 * qz1 + 0.2 * qz2 + 0.05 * d;
    total += bonus;
    return Math.min(100, total);
};

// Electronic Product Design: T= GAA*3 + 0.5*(Qz1+Qz2) + 0.3*F
// Note: GAA max is 10, Qz max is 40. We need to normalize or use raw values.
// The formula implies raw values. Let's assume input is out of 100 and we scale down, OR input is raw.
// To keep UI consistent (everything out of 100), we should scale inputs.
// GAA (100) -> 10: * 0.1
// Qz (100) -> 40: * 0.4
// F (100) -> 100: * 1
// Formula becomes: (GAA*0.1)*3 + 0.5*((Qz1*0.4) + (Qz2*0.4)) + 0.3*F
// = 0.3*GAA + 0.2*Qz1 + 0.2*Qz2 + 0.3*F
const epdFormula = (scores: Record<ComponentId, number>) => {
    const gaa = scores.gaa || 0;
    const qz1 = scores.quiz1 || 0;
    const qz2 = scores.quiz2 || 0;
    const f = scores.endTerm || 0;
    const bonus = scores.bonus || 0;

    let total = 0.3 * gaa + 0.2 * qz1 + 0.2 * qz2 + 0.3 * f;
    total += bonus;
    return Math.min(100, total);
};

// Strategies for Professional Growth: T = 0.15*GAA + 0.25*GP + 0.25*Qz2 + 0.35*F
const spgFormula = (scores: Record<ComponentId, number>) => {
    const gaa = scores.gaa || 0;
    const gp = scores.gp1 || 0; // Using gp1 for Group Project
    const qz2 = scores.quiz2 || 0;
    const f = scores.endTerm || 0;
    const bonus = scores.bonus || 0;

    let total = 0.15 * gaa + 0.25 * gp + 0.25 * qz2 + 0.35 * f;
    total += bonus;
    return Math.min(100, total);
};


export const SUBJECTS: Subject[] = [
    // --- BS Data Science (Existing) ---
    // Foundation
    {
        id: 'math1',
        name: 'Mathematics for Data Science 1',
        level: 'Foundation',
        degreeType: 'BS_DS',
        schema: {
            components: ['gaa', 'quiz1', 'quiz2', 'endTerm', 'bonus'],
            calculateScore: standardFoundationFormula,
        },
    },
    {
        id: 'stats1',
        name: 'Statistics for Data Science 1',
        level: 'Foundation',
        degreeType: 'BS_DS',
        schema: {
            components: ['gaa', 'quiz1', 'quiz2', 'endTerm', 'bonus'],
            calculateScore: standardFoundationFormula,
        },
    },
    {
        id: 'ct',
        name: 'Computational Thinking',
        level: 'Foundation',
        degreeType: 'BS_DS',
        schema: {
            components: ['gaa', 'quiz1', 'quiz2', 'endTerm', 'bonus'],
            calculateScore: standardFoundationFormula,
        },
    },
    {
        id: 'english1',
        name: 'English 1',
        level: 'Foundation',
        degreeType: 'BS_DS',
        schema: {
            components: ['gaa', 'quiz1', 'quiz2', 'endTerm', 'bonus'],
            calculateScore: standardFoundationFormula,
        },
    },
    {
        id: 'math2',
        name: 'Mathematics for Data Science 2',
        level: 'Foundation',
        degreeType: 'BS_DS',
        schema: {
            components: ['gaa', 'quiz1', 'quiz2', 'endTerm', 'bonus'],
            calculateScore: standardFoundationFormula,
        },
    },
    {
        id: 'stats2',
        name: 'Statistics for Data Science 2',
        level: 'Foundation',
        degreeType: 'BS_DS',
        schema: {
            components: ['gaa', 'quiz1', 'quiz2', 'endTerm', 'bonus'],
            calculateScore: standardFoundationFormula,
        },
    },
    {
        id: 'python',
        name: 'Intro to Python Programming',
        level: 'Foundation',
        degreeType: 'BS_DS',
        schema: {
            components: ['gaa', 'grpa', 'quiz1', 'oppe1', 'oppe2', 'endTerm', 'bonus'],
            calculateScore: pythonFormula,
        },
    },
    {
        id: 'english2',
        name: 'English 2',
        level: 'Foundation',
        degreeType: 'BS_DS',
        schema: {
            components: ['gaa', 'quiz1', 'quiz2', 'endTerm', 'bonus'],
            calculateScore: standardFoundationFormula,
        },
    },

    // Diploma
    {
        id: 'mlf',
        name: 'Machine Learning Foundations',
        level: 'Diploma',
        degreeType: 'BS_DS',
        schema: {
            components: ['gaa', 'quiz1', 'quiz2', 'endTerm', 'bonus'],
            calculateScore: standardFoundationFormula,
        },
    },
    {
        id: 'mlt',
        name: 'Machine Learning Techniques',
        level: 'Diploma',
        degreeType: 'BS_DS',
        schema: {
            components: ['gaa', 'quiz1', 'quiz2', 'endTerm', 'bonus'],
            calculateScore: mltFormula,
        },
    },
    {
        id: 'mlp',
        name: 'Machine Learning Practice',
        level: 'Diploma',
        degreeType: 'BS_DS',
        schema: {
            components: ['gaa', 'quiz1', 'quiz2', 'endTerm', 'bonus'],
            calculateScore: standardFoundationFormula,
        }
    },
    {
        id: 'bdm',
        name: 'Business Data Management',
        level: 'Diploma',
        degreeType: 'BS_DS',
        schema: {
            components: ['gaa', 'quiz1', 'quiz2', 'endTerm', 'bonus'],
            calculateScore: standardFoundationFormula,
        }
    },
    {
        id: 'ba',
        name: 'Business Analytics',
        level: 'Diploma',
        degreeType: 'BS_DS',
        schema: {
            components: ['gaa', 'quiz1', 'quiz2', 'endTerm', 'bonus'],
            calculateScore: standardFoundationFormula,
        }
    },
    {
        id: 'tools',
        name: 'Tools in Data Science',
        level: 'Diploma',
        degreeType: 'BS_DS',
        schema: {
            components: ['gaa', 'roe', 'project1', 'project2', 'endTerm', 'bonus'],
            calculateScore: toolsFormula,
        }
    },
    {
        id: 'pdsa',
        name: 'Programming Data Structures and Algorithms',
        level: 'Diploma',
        degreeType: 'BS_DS',
        schema: {
            components: ['gaa', 'quiz1', 'quiz2', 'oppe', 'endTerm', 'bonus'],
            calculateScore: pdsaFormula,
        }
    },
    {
        id: 'dbms',
        name: 'Database Management Systems',
        level: 'Diploma',
        degreeType: 'BS_DS',
        schema: {
            components: ['gaa', 'gaa_sql', 'gaa_prog', 'quiz1', 'quiz2', 'oppe', 'endTerm', 'bonus'],
            calculateScore: dbmsFormula,
        }
    },
    {
        id: 'appdev1',
        name: 'Application Development 1',
        level: 'Diploma',
        degreeType: 'BS_DS',
        schema: {
            components: ['gla', 'gaa', 'quiz1', 'quiz2', 'endTerm', 'bonus'],
            calculateScore: appDev1Formula,
        }
    },
    {
        id: 'java',
        name: 'Programming Concepts using Java',
        level: 'Diploma',
        degreeType: 'BS_DS',
        schema: {
            components: ['gaa', 'quiz1', 'quiz2', 'oppe', 'endTerm', 'bonus'],
            calculateScore: pdsaFormula,
        }
    },
    {
        id: 'sc',
        name: 'System Commands',
        level: 'Diploma',
        degreeType: 'BS_DS',
        schema: {
            components: ['gaa', 'bpta', 'quiz1', 'oppe', 'endTerm', 'bonus'],
            calculateScore: systemCommandsFormula,
        }
    },
    {
        id: 'appdev2',
        name: 'Application Development 2',
        level: 'Diploma',
        degreeType: 'BS_DS',
        schema: {
            components: ['gaa_obj', 'gaa_prog', 'quiz1', 'quiz2', 'endTerm', 'bonus'],
            calculateScore: appDev2Formula,
        }
    },

    // Degree
    {
        id: 'software_testing',
        name: 'Software Testing',
        level: 'Degree',
        degreeType: 'BS_DS',
        schema: {
            components: ['gaa', 'quiz1', 'quiz2', 'endTerm'],
            calculateScore: degreeStandardFormula,
        },
    },
    {
        id: 'software_engineering',
        name: 'Software Engineering',
        level: 'Degree',
        degreeType: 'BS_DS',
        schema: {
            components: ['gaa', 'quiz1', 'quiz2', 'endTerm', 'bonus'],
            calculateScore: standardFoundationFormula,
        },
    },
    {
        id: 'deep_learning',
        name: 'Deep Learning',
        level: 'Degree',
        degreeType: 'BS_DS',
        schema: {
            components: ['gaa', 'quiz1', 'quiz2', 'endTerm', 'bonus'],
            calculateScore: degreeStandardFormula,
        },
    },
    {
        id: 'ai_search',
        name: 'AI: Search Methods for Problem Solving',
        level: 'Degree',
        degreeType: 'BS_DS',
        schema: {
            components: ['gaa', 'quiz1', 'quiz2', 'endTerm'],
            calculateScore: degreeStandardFormula,
        }
    },
    {
        id: 'strategies',
        name: 'Strategies for Professional Growth',
        level: 'Degree',
        degreeType: 'BS_DS',
        schema: {
            components: ['gaa', 'quiz1', 'quiz2', 'endTerm'],
            calculateScore: degreeStandardFormula,
        }
    },
    {
        id: 'big_data',
        name: 'Introduction to Big Data',
        level: 'Degree',
        degreeType: 'BS_DS',
        schema: {
            components: ['gaa', 'quiz1', 'quiz2', 'endTerm'],
            calculateScore: degreeStandardFormula,
        }
    },
    {
        id: 'c_prog',
        name: 'Programming in C',
        level: 'Degree',
        degreeType: 'BS_DS',
        schema: {
            components: ['gaa', 'quiz1', 'quiz2', 'endTerm'],
            calculateScore: degreeStandardFormula,
        }
    },
    {
        id: 'dl_cv',
        name: 'Deep Learning for CV',
        level: 'Degree',
        degreeType: 'BS_DS',
        schema: {
            components: ['gaa', 'quiz1', 'quiz2', 'endTerm'],
            calculateScore: degreeStandardFormula,
        }
    },
    {
        id: 'llm',
        name: 'Large Language Models',
        level: 'Degree',
        degreeType: 'BS_DS',
        schema: {
            components: ['gaa', 'quiz1', 'quiz2', 'endTerm'],
            calculateScore: degreeStandardFormula,
        }
    },

    // --- BS Electronic Systems ---
    // Foundation
    {
        id: 'es_english1',
        name: 'English I',
        level: 'Foundation',
        degreeType: 'BS_ES',
        schema: {
            components: ['gaa', 'quiz1', 'quiz2', 'endTerm', 'bonus'],
            calculateScore: standardFoundationFormula,
        },
    },
    {
        id: 'es_math1',
        name: 'Math for Electronics I',
        level: 'Foundation',
        degreeType: 'BS_ES',
        schema: {
            components: ['gaa', 'quiz1', 'quiz2', 'endTerm', 'bonus'],
            calculateScore: standardFoundationFormula,
        },
    },
    {
        id: 'es_estc',
        name: 'Electronic Systems Thinking and Circuits',
        level: 'Foundation',
        degreeType: 'BS_ES',
        schema: {
            components: ['gaa', 'quiz1', 'quiz2', 'endTerm', 'bonus'],
            calculateScore: standardFoundationFormula,
        },
    },
    {
        id: 'es_estc_lab',
        name: 'Electronic Systems Thinking and Circuits Laboratory',
        level: 'Foundation',
        degreeType: 'BS_ES',
        schema: {
            components: ['we', 'id'],
            calculateScore: electronicsLabFormula, // Similar structure
        },
    },
    {
        id: 'es_c_prog',
        name: 'Introduction to C Programming',
        level: 'Foundation',
        degreeType: 'BS_ES',
        schema: {
            components: ['gaa', 'quiz1', 'oppe1', 'oppe2', 'endTerm', 'bonus'],
            calculateScore: (scores) => {
                const gaa = scores.gaa || 0;
                const qz1 = scores.quiz1 || 0;
                const oppe1 = scores.oppe1 || 0;
                const oppe2 = scores.oppe2 || 0;
                const f = scores.endTerm || 0;
                const bonus = scores.bonus || 0;
                let total = 0.1 * gaa + 0.2 * qz1 + 0.4 * f + Math.max(0.15 * oppe1 + 0.15 * oppe2, 0.20 * Math.max(oppe1, oppe2));
                total += bonus;
                return Math.min(100, total);
            }
        },
    },
    {
        id: 'es_c_lab',
        name: 'Introduction to C Programming Lab',
        level: 'Foundation',
        degreeType: 'BS_ES',
        schema: {
            components: ['gla', 'id'], // gla for TLA
            calculateScore: labFormula,
        },
    },
    {
        id: 'es_english2',
        name: 'English II',
        level: 'Foundation',
        degreeType: 'BS_ES',
        schema: {
            components: ['gaa', 'quiz1', 'quiz2', 'endTerm', 'bonus'],
            calculateScore: standardFoundationFormula,
        },
    },
    {
        id: 'es_linux',
        name: 'Introduction to Linux Programming',
        level: 'Foundation',
        degreeType: 'BS_ES',
        schema: {
            components: ['gaa', 'nppe', 'quiz1', 'oppe', 'endTerm', 'bpta', 'vmt', 'bonus'],
            calculateScore: linuxFormula,
        },
    },
    {
        id: 'es_linux_lab',
        name: 'Introduction to the Linux Shell Lab',
        level: 'Foundation',
        degreeType: 'BS_ES',
        schema: {
            components: ['gla', 'id'], // gla for OL
            calculateScore: labFormula,
        },
    },
    {
        id: 'es_digital',
        name: 'Digital Systems',
        level: 'Foundation',
        degreeType: 'BS_ES',
        schema: {
            components: ['gaa', 'quiz1', 'quiz2', 'endTerm', 'bonus'],
            calculateScore: standardFoundationFormula,
        },
    },
    {
        id: 'es_eec',
        name: 'Electrical and Electronic Circuits',
        level: 'Foundation',
        degreeType: 'BS_ES',
        schema: {
            components: ['gaa', 'quiz1', 'quiz2', 'endTerm', 'bonus'],
            calculateScore: standardFoundationFormula,
        },
    },
    {
        id: 'es_elec_lab',
        name: 'Electronics Laboratory',
        level: 'Foundation',
        degreeType: 'BS_ES',
        schema: {
            components: ['we', 'id'],
            calculateScore: electronicsLabFormula,
        },
    },
    {
        id: 'es_embedded',
        name: 'Embedded C Programming',
        level: 'Foundation',
        degreeType: 'BS_ES',
        schema: {
            components: ['gaa', 'grpa', 'quiz1', 'quiz2', 'endTerm', 'bonus'],
            calculateScore: embeddedCFormula,
        },
    },
    {
        id: 'es_embedded_lab',
        name: 'Embedded C Programming Laboratory',
        level: 'Foundation',
        degreeType: 'BS_ES',
        schema: {
            components: ['cp', 'le'], // cp for Attendance, le for Lab/Viva
            calculateScore: embeddedCLabFormula,
        },
    },

    // Diploma
    {
        id: 'es_math2',
        name: 'Math for Electronics II',
        level: 'Diploma',
        degreeType: 'BS_ES',
        schema: {
            components: ['gaa', 'quiz1', 'quiz2', 'endTerm', 'bonus'],
            calculateScore: standardFoundationFormula,
        },
    },
    {
        id: 'es_signals',
        name: 'Signals and Systems',
        level: 'Diploma',
        degreeType: 'BS_ES',
        schema: {
            components: ['gaa', 'quiz1', 'quiz2', 'endTerm', 'grpa', 'bonus'],
            calculateScore: signalsFormula,
        },
    },
    {
        id: 'es_python',
        name: 'Python Programming',
        level: 'Diploma',
        degreeType: 'BS_ES',
        schema: {
            components: ['gaa', 'grpa', 'quiz1', 'oppe1', 'oppe2', 'endTerm', 'bonus'],
            calculateScore: pythonFormula,
        },
    },
    {
        id: 'es_analog',
        name: 'Analog Electronic Systems',
        level: 'Diploma',
        degreeType: 'BS_ES',
        schema: {
            components: ['gaa', 'quiz1', 'quiz2', 'endTerm', 'bonus'],
            calculateScore: standardFoundationFormula,
        },
    },
    {
        id: 'es_analog_lab',
        name: 'Analog Electronics Laboratory',
        level: 'Diploma',
        degreeType: 'BS_ES',
        schema: {
            components: ['we', 'id'],
            calculateScore: electronicsLabFormula,
        },
    },
    {
        id: 'es_dsp',
        name: 'Digital Signal Processing',
        level: 'Diploma',
        degreeType: 'BS_ES',
        schema: {
            components: ['gaa', 'le', 'lv', 'quiz1', 'quiz2', 'endTerm', 'bonus'],
            calculateScore: dspFormula,
        },
    },
    {
        id: 'es_dsd',
        name: 'Digital System Design',
        level: 'Diploma',
        degreeType: 'BS_ES',
        schema: {
            components: ['gaa', 'grpa', 'quiz1', 'quiz2', 'endTerm', 'bonus'],
            calculateScore: embeddedCFormula, // Same formula structure
        },
    },
    {
        id: 'es_dsd_lab',
        name: 'Digital System Design Laboratory',
        level: 'Diploma',
        degreeType: 'BS_ES',
        schema: {
            components: ['we', 'id'],
            calculateScore: electronicsLabFormula,
        },
    },
    {
        id: 'es_sensors',
        name: 'Sensors and Applications',
        level: 'Diploma',
        degreeType: 'BS_ES',
        schema: {
            components: ['gaa', 'quiz1', 'quiz2', 'endTerm', 'bonus'],
            calculateScore: standardFoundationFormula,
        },
    },
    {
        id: 'es_sensors_lab',
        name: 'Sensors Laboratory',
        level: 'Diploma',
        degreeType: 'BS_ES',
        schema: {
            components: ['we', 'id'],
            calculateScore: electronicsLabFormula,
        },
    },
    {
        id: 'es_control',
        name: 'Control Engineering',
        level: 'Diploma',
        degreeType: 'BS_ES',
        schema: {
            components: ['gaa', 'quiz1', 'quiz2', 'endTerm', 'd', 'bonus'],
            calculateScore: controlFormula,
        },
    },

    // Degree
    {
        id: 'es_comp_org',
        name: 'Computer Organization',
        level: 'Degree',
        degreeType: 'BS_ES',
        schema: {
            components: ['gaa', 'quiz1', 'quiz2', 'endTerm', 'bonus'],
            calculateScore: standardFoundationFormula,
        },
    },
    {
        id: 'es_em_fields',
        name: 'Electromagnetic Fields and Transmission Lines',
        level: 'Degree',
        degreeType: 'BS_ES',
        schema: {
            components: ['gaa', 'quiz1', 'quiz2', 'endTerm', 'bonus'],
            calculateScore: standardFoundationFormula,
        },
    },
    {
        id: 'es_epd',
        name: 'Electronic Product Design',
        level: 'Degree',
        degreeType: 'BS_ES',
        schema: {
            components: ['gaa', 'quiz1', 'quiz2', 'endTerm', 'bonus'],
            calculateScore: epdFormula,
        },
    },
    {
        id: 'es_spg',
        name: 'Strategies for Professional Growth',
        level: 'Degree',
        degreeType: 'BS_ES',
        schema: {
            components: ['gaa', 'gp1', 'quiz2', 'endTerm', 'bonus'],
            calculateScore: spgFormula,
        },
    },
    {
        id: 'es_embedded_linux',
        name: 'Embedded Linux and FPGAs',
        level: 'Degree',
        degreeType: 'BS_ES',
        schema: {
            components: ['gaa', 'grpa', 'quiz1', 'quiz2', 'endTerm', 'bonus'],
            calculateScore: embeddedCFormula,
        },
    },
    {
        id: 'es_embedded_linux_lab',
        name: 'Embedded Linux and FPGAs Lab',
        level: 'Degree',
        degreeType: 'BS_ES',
        schema: {
            components: ['cp', 'le'],
            calculateScore: embeddedCLabFormula,
        },
    },
    {
        id: 'es_etm',
        name: 'Electronic Testing and Measurement',
        level: 'Degree',
        degreeType: 'BS_ES',
        schema: {
            components: ['gaa', 'grpa', 'quiz1', 'quiz2', 'endTerm', 'bonus'],
            calculateScore: embeddedCFormula,
        },
    },
    {
        id: 'es_semi',
        name: 'Semiconductor Devices and VLSI Technology',
        level: 'Degree',
        degreeType: 'BS_ES',
        schema: {
            components: ['gaa', 'quiz1', 'quiz2', 'endTerm', 'bonus'],
            calculateScore: standardFoundationFormula,
        },
    },
    {
        id: 'es_mlf',
        name: 'Machine Learning Foundations (Open Elective)',
        level: 'Degree',
        degreeType: 'BS_ES',
        schema: {
            components: ['gaa', 'quiz1', 'quiz2', 'endTerm', 'bonus'],
            calculateScore: standardFoundationFormula,
        },
    },
];


export const getGrade = (score: number) => {
    if (score >= 90) return 'S';
    if (score >= 80) return 'A';
    if (score >= 70) return 'B';
    if (score >= 60) return 'C';
    if (score >= 50) return 'D';
    if (score >= 40) return 'E';
    return 'U'; // Fail
};

export const getRequiredMarks = (
    currentScores: Record<ComponentId, number>,
    targetGrade: string,
    subject: Subject
): number | 'Impossible' | 'Already Achieved' => {
    // This is a complex reverse calculation.
    // For MVP, we will simulate "End Term" needed.
    // We iterate End Term from 0 to 100 and find the first value that gives the target grade.

    const targetScore =
        targetGrade === 'S' ? 90 :
            targetGrade === 'A' ? 80 :
                targetGrade === 'B' ? 70 :
                    targetGrade === 'C' ? 60 :
                        targetGrade === 'D' ? 50 :
                            targetGrade === 'E' ? 40 : 0;

    // If already achieved without end term (unlikely but possible with high bonus/internals?)
    // Actually usually End Term is mandatory.

    for (let f = 0; f <= 100; f++) {
        const tempScores = { ...currentScores, endTerm: f };
        const score = subject.schema.calculateScore(tempScores);
        if (score >= targetScore) {
            return f;
        }
    }

    return 'Impossible';
};

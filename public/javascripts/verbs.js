'use strict';

var verbGrammar = {};

var MoodList =
    ["indicative",
        "subjunctive",
        "infinitive",
        "imperative"];

var VoiceList =
    ["active",
        "passive"];

var TenseList =
    ["present",
        "imperfect",
        "future",
        "perfect",
        "pluperfect",
        "future perfect"];

var PersonList =
    ["1st person singular",
        "2nd person singular",
        "3rd person singular",
        "1st person plural",
        "2nd person plural",
        "3rd person plural"];

var Conjugations = [
    {
        "Mood":				//1st conj.
            [{
                "Voice":		//indicative
                    [{
                        "Tense":	//active
                            [{
                                "Ending": ["o", "as", "at", "amus", "atis", "ant"]
                            },
                                {
                                    "Ending": ["abam", "abas", "abat", "abamus", "abatis", "abant"]
                                },
                                {
                                    "Ending": ["abo", "abis", "abit", "abimus", "abitis", "abunt"]
                                }
                            ]
                    },
                        {
                            "Tense":		//passive
                                [{
                                    "Ending": ["or", "aris", "atur", "amur", "amini", "antur"]
                                },
                                    {
                                        "Ending": ["abar", "abaris", "abatur", "abamur", "abamini", "abantur"]
                                    },
                                    {
                                        "Ending": ["abor", "aberis", "abitur", "abimur", "abimini", "abuntur"]
                                    }
                                ]
                        }
                    ]
            },
                {
                    "Voice":		//subjunctive
                        [{
                            "Tense":	//active
                                [{
                                    "Ending": ["em", "es", "et", "emus", "etis", "ent"]
                                },
                                    {
                                        "Ending": ["arem", "ares", "aret", "aremus", "aretis", "arent"]
                                    }
                                ]
                        },
                            {
                                "Tense":		//passive
                                    [{
                                        "Ending": ["er", "eris", "etur", "emur", "emini", "entur"]
                                    },
                                        {
                                            "Ending": ["arer", "areris", "aretur", "aremur", "aremini", "arentur"]
                                        }
                                    ]
                            }
                        ]
                }
            ]
    },
    {
        "Mood":				//2nd conj.
            [{
                "Voice":		//indicative
                    [{
                        "Tense":	//active
                            [{
                                "Ending": ["eo", "es", "et", "emus", "etis", "ent"]
                            },
                                {
                                    "Ending": ["ebam", "ebas", "ebat", "ebamus", "ebatis", "ebant"]
                                },
                                {
                                    "Ending": ["ebo", "ebis", "ebit", "ebimus", "ebitis", "ebunt"]
                                }
                            ]
                    },
                        {
                            "Tense":		//passive
                                [{
                                    "Ending": ["eor", "eris", "etur", "emur", "emini", "entur"]
                                },
                                    {
                                        "Ending": ["ebar", "ebaris", "ebatur", "ebamur", "ebamini", "ebantur"]
                                    },
                                    {
                                        "Ending": ["ebor", "eberis", "ebitur", "ebimur", "ebimini", "ebuntur"]
                                    }
                                ]
                        }
                    ]
            },
                {
                    "Voice":		//subjunctive
                        [{
                            "Tense":	//active
                                [{
                                    "Ending": ["eam", "eas", "eat", "eamus", "eatis", "eant"]
                                },
                                    {
                                        "Ending": ["erem", "eres", "eret", "eremus", "eretis", "erent"]
                                    }
                                ]
                        },
                            {
                                "Tense":		//passive
                                    [{
                                        "Ending": ["erer", "ereris", "eretur", "eremur", "eremini", "erentur"]
                                    },
                                        {
                                            "Ending": ["erer", "ereris", "eretur", "eremur", "eremini", "erentur"]
                                        }
                                    ]
                            }
                        ]
                }
            ]
    },
    {
        "Mood":				//3rd conj.
            [{
                "Voice":		//indicative
                    [{
                        "Tense":	//active
                            [{
                                "Ending": ["o", "is", "it", "imus", "itis", "unt"]
                            },
                                {
                                    "Ending": ["ebam", "ebas", "ebat", "ebamus", "ebatis", "ebant"]
                                },
                                {
                                    "Ending": ["am", "es", "et", "emus", "etis", "ent"]
                                }
                            ]
                    },
                        {
                            "Tense":		//passive
                                [{
                                    "Ending": ["or", "eris", "itur", "imur", "imini", "untur"]
                                },
                                    {
                                        "Ending": ["ebar", "ebaris", "ebatur", "ebamur", "ebamini", "ebantur"]
                                    },
                                    {
                                        "Ending": ["ar", "eris", "etur", "emur", "emini", "entur"]
                                    }
                                ]
                        }
                    ]
            },
                {
                    "Voice":		//subjunctive
                        [{
                            "Tense":	//active
                                [{
                                    "Ending": ["am", "as", "at", "amus", "atis", "ant"]
                                },
                                    {
                                        "Ending": ["erem", "eres", "eret", "eremus", "eretis", "erent"]
                                    }
                                ]
                        },
                            {
                                "Tense":		//passive
                                    [{
                                        "Ending": ["ar", "aris", "atur", "amur", "amini", "antur"]
                                    },
                                        {
                                            "Ending": ["erer", "ereris", "eretur", "eremur", "eremini", "erentur"]
                                        }
                                    ]
                            }
                        ]
                }
            ]
    },
    {
        "Mood":				//3rd io conj.
            [{
                "Voice":		//indicative
                    [{
                        "Tense":	//active
                            [{
                                "Ending": ["io", "is", "it", "imus", "itis", "iunt"]
                            },
                                {
                                    "Ending": ["iebam", "iebas", "iebat", "iebamus", "iebatis", "iebant"]
                                },
                                {
                                    "Ending": ["iam", "ies", "iet", "iemus", "ietis", "ient"]
                                }
                            ]
                    },
                        {
                            "Tense":		//passive
                                [{
                                    "Ending": ["ior", "ieris", "ietur", "iemur", "iemini", "iuntur"]
                                },
                                    {
                                        "Ending": ["iebar", "iebaris", "iebatur", "iebamur", "iebamini", "iebantur"]
                                    },
                                    {
                                        "Ending": ["iar", "ieris", "ietur", "iemur", "iemini", "ientur"]
                                    }
                                ]
                        }
                    ]
            },
                {
                    "Voice":		//subjunctive
                        [{
                            "Tense":	//active
                                [{
                                    "Ending": ["iam", "ias", "iat", "iamus", "iatis", "iant"]
                                },
                                    {
                                        "Ending": ["erem", "eres", "eret", "eremus", "eretis", "erent"]
                                    }
                                ]
                        },
                            {
                                "Tense":		//passive
                                    [{
                                        "Ending": ["iar", "iaris", "iatur", "iamur", "iamini", "iantur"]
                                    },
                                        {
                                            "Ending": ["erer", "ereris", "eretur", "eremur", "eremini", "erentur"]
                                        }
                                    ]
                            }
                        ]
                }
            ]
    },
    {
        "Mood":				//4th conj.
            [{
                "Voice":		//indicative
                    [{
                        "Tense":	//active
                            [{
                                "Ending": ["io", "is", "it", "imus", "itis", "iunt"]
                            },
                                {
                                    "Ending": ["iebam", "iebas", "iebat", "iebamus", "iebatis", "iebant"]
                                },
                                {
                                    "Ending": ["iam", "ies", "iet", "iemus", "ietis", "ient"]
                                }
                            ]
                    },
                        {
                            "Tense":		//passive
                                [{
                                    "Ending": ["ior", "ieris", "ietur", "iemur", "iemini", "iuntur"]
                                },
                                    {
                                        "Ending": ["iebar", "iebaris", "iebatur", "iebamur", "iebamini", "iebantur"]
                                    },
                                    {
                                        "Ending": ["iar", "ieris", "ietur", "iemur", "iemini", "ientur"]
                                    }
                                ]
                        }
                    ]
            },
                {
                    "Voice":		//subjunctive
                        [{
                            "Tense":	//active
                                [{
                                    "Ending": ["iam", "ias", "iat", "iamus", "iatis", "iant"]
                                },
                                    {
                                        "Ending": ["erem", "eres", "eret", "eremus", "eretis", "erent"]
                                    }
                                ]
                        },
                            {
                                "Tense":		//passive
                                    [{
                                        "Ending": ["iar", "iaris", "iatur", "iamur", "iamini", "iantur"]
                                    },
                                        {
                                            "Ending": ["erer", "ereris", "eretur", "eremur", "eremini", "erentur"]
                                        }
                                    ]
                            }
                        ]
                }
            ]
    }
];

var PerfectEndings = {
    "Mood": [
        {
            "Tense":		//indicative
                [{
                    "Ending": ["i", "isti", "it", "imus", "istis", "erunt"]
                },
                    {
                        "Ending": ["eram", "eras", "erat", "eramus", "eratis", "erant"]
                    },
                    {
                        "Ending": ["ero", "eris", "erit", "erimus", "eritis", "erint"]
                    }
                ]
        },
        {
            "Tense":		//subjunctive
                [{
                    "Ending": ["erim", "eris", "erit", "erimus", "eritis", "erint"]
                },
                    {
                        "Ending": ["issem", "isses", "isset", "issemus", "issetis", "issent"]
                    }
                ]
        }
    ]
};

var InfinitiveEndings = {
    "Voice": [
        {
            "Conjugation":			//active
                ["are", "ere", "ere", "ere", "ire"]
        },
        {
            "Conjugation":			//passive
                ["ari", "ere", "i", "i", "iri"]
        }
    ]
};

var Esse = {
    "Mood": [
        {
            "Tense":		//indicative
                [{
                    "Ending": ["sum", "es", "est", "sumus", "estis", "sunt"]
                },
                    {
                        "Ending": ["eram", "eras", "erat", "eramus", "eratis", "erant"]
                    },
                    {
                        "Ending": ["ero", "eris", "erit", "erimus", "eritis", "erunt"]
                    }
                ]
        },
        {
            "Tense":		//subjunctive
                [{
                    "Ending": ["sim", "sis", "sit", "simus", "sitis", "sint"]
                },
                    {
                        "Ending": ["essem", "esses", "esset", "essemus", "essetis", "essent"]
                    }
                ]
        }
    ]
};

var EnglPronouns = {
    "Case": [
        {
            "Person":				//nominative
                ["I", "you", "he/she/it", "we", "you all", "they"]
        },
        {
            "Person":				//oblique
                ["me", "you", "him/her/it", "us", "you all", "them"]
        },
        {
            "Person":				//possessive adjective
                ["my", "your", "his/her/its", "our", "your", "their"]
        },
        {
            "Person":				//possessive pronoun
                ["mine", "yours", "his/hers/its", "ours", "yours", "theirs"]
        }
    ]
};

var EnglToBe = {
    "Mood": [
        {
            "Tense":				//indicative
                [{"Person": ["am", "are", "is", "are", "are", "are"]},		//present
                    {"Person": ["was", "were", "was", "were", "were", "were"]}	//past
                ]
        },
        {
            "Tense":				//subjunctive
                [{"Person": ["were", "were", "were", "were", "were", "were"]},
                    {"Person": ["had been", "had been", "had been", "had been", "had been", "had been"]},
                ]
        },
        {
            "Tense":				//infinitive
                [{"Form": "to be"},
                    {"Form": "to have been"}
                ]
        }
    ],
    "PresPart": "being",
    "PastPart": "been"
};

var EnglToHave = {
    "Pres": "have",
    "PresConj": "has",
    "PresPart": "having",
    "Past": "had",
    "PastPart": "had"
};

//public methods:
verbGrammar.tenseToAspect = tenseToAspect;
verbGrammar.aspectToTense = aspectToTense;
verbGrammar.getVerbForm = getVerbForm;
verbGrammar.validateVoid = validateVoice;
verbGrammar.Verb = Verb;

function tenseToAspect(tense) {
    var aspect;
    if (tense>=0&&tense<3)
        aspect=0;
    else if (tense>=3&&tense<6)
    {
        aspect=1;
        tense-=3;
    }

    return ({"tense":tense, "aspect":aspect});
}

function aspectToTense(aspect, tense) {
    if (aspect==0)
        return tense;
    else if (aspect==1)
        return tense+3;
    else
    {
        console.log("Invalid aspect (" + aspect + ") in aspectToTense()");
        return null;
    }
}

//forms a verb based on a lexical entry (passed as element, not index #) and proper aspect, mood, tense, voice, and person
function getVerbForm(newVerb) {
    var pppEnd;

    if (newVerb.mood == 0 || newVerb.mood == 1) {
        if (newVerb.aspect == 0)		//incomplete
        {
            return (newVerb.lexis.PresStem + Conjugations[newVerb.lexis.Conjugation].Mood[newVerb.mood].Voice[newVerb.voice].Tense[newVerb.tense].Ending[newVerb.person]);

        }
        else {
            if (newVerb.voice == 0)		//active
            {
                return (newVerb.lexis.PerfStem + PerfectEndings.Mood[newVerb.mood].Tense[newVerb.tense].Ending[newVerb.person]);
            }
            else {
                pppEnd = (newVerb.person < 3) ? "us" : "i";
                return (newVerb.lexis.PerfPassPart + pppEnd + " " + Esse.Mood[newVerb.mood].Tense[newVerb.tense].Ending[newVerb.person]);
            }
        }
    }

    else if (newVerb.mood == 2) {           //infinitive
        if (newVerb.voice == 0) {
            switch (newVerb.tense) {
                case 0:
                    return (newVerb.lexis.PresStem + InfinitiveEndings.Voice[0].Conjugation[newVerb.lexis.Conjugation]);
                    break;
                case 1:
                    return (newVerb.lexis.PerfStem + "isse");
                    break;
                default:				//only present and past active infins for now
                    console.log("Currently invalid tense!");
                    return null;
            }
        }
        else if (newVerb.voice == 1) {
            switch (newVerb.tense) {
                case 0:
                    return (newVerb.lexis.PresStem + InfinitiveEndings.Voice[1].Conjugation[newVerb.lexis.Conjugation]);
                    break;
                default:				//only present passive infins for now
                    console.log("Currently invalid tense!");
                    return null;
            }
        }
        else {
            console.log("Invalid voice (" + newVerb.voice + ") in getVerbForm()");
            return null;
        }
    }

    else {
        console.log("Currently invalid mood (" + newVerb.mood + ") in getVerbForm()");
        return null;
    }

}

function validateVoice(newVerb) {
    var wasChanged = 0;
    if (newVerb.lexis.IsDepon == true && newVerb.voice == 0) {
        newVerb.voice = 1;
        wasChanged = 1;
    }
    else if (newVerb.lexis.IsSemiDepon == true && newVerb.aspect == 1 && newVerb.voice == 0) {
        newVerb.voice = 1;
        wasChanged = 1;
    }
    else if (newVerb.lexis.HasNoPassive == true && newVerb.voice == 1) {
        newVerb.voice = 0;
        wasChanged = 1;
    }

    return wasChanged;
}

/////////////////////////////
//constructor for Verb object - must generate random properties ahead of time
/////////////////////////////
function Verb() {
    for (var n in arguments[0]) {
        this[n] = arguments[0][n];
    }

    if (this.lexis == undefined)
//        this.lexis = getRandomVerbLexis();
        this.lexis = VerbList[0];
    if (this.mood == undefined)
//        this.mood = getRandomMood();
        this.mood = 0;
    if (this.aspect == undefined)
//        this.aspect = getRandomAspect();
        this.aspect = 0;
    if (this.person == undefined)
//        this.person = getRandomPerson(this.mood);
        this.person = 0;

    if (this.tense == undefined)
//        this.tense = getRandomTense(this.mood);
        this.person = 0;
    if (this.voice == undefined)
//        this.voice = getRandomVoice(this.lexis, this.aspect);
        this.voice = 0;
    validateVoice(this);

    this.form = getVerbForm(this);			//even if "Verb.form" is given among arguments, this should be run
}

Verb.prototype.getForm = function () {
    return this.form;
};

//gives the english translation of the current Verb
//(using present continuous, standard imperfect, standard future - "I will carry", and simple past)
Verb.prototype.getTranslation = function () {
    //lazyload prevention of running all this crap again
    if (this.englTrans == undefined) {

        var pronoun;
        if (this.mood == 0 || this.mood == 1)		//indicative AND subjunctive -
        {						//for now we will translate the latter as if in a subordinate clause
            pronoun = EnglPronouns.Case[0].Person[this.person];
        }
        else {
            console.log("Currently invalid mood!");
        }

        //to avoid a triple conditional
        var tense = aspectToTense(this.aspect, this.tense);

        var verbPhrase;
        if (this.voice == 0)			//active
        {
            switch (tense) {
                case 0:
                    verbPhrase = EnglToBe.Mood[0].Tense[0].Person[this.person] + " " + this.lexis.EnglPresPart;
                    break;
                case 1:
                    verbPhrase = EnglToBe.Mood[0].Tense[1].Person[this.person] + " " + this.lexis.EnglPresPart;
                    break;
                case 2:
                    verbPhrase = "will " + this.lexis.EnglPres;
                    break;
                case 3:
                    verbPhrase = this.lexis.EnglPast;
                    break;
                case 4:
                    verbPhrase = "had " + this.lexis.EnglPastPart;
                    break;
                case 5:
                    verbPhrase = "will have " + this.lexis.EnglPastPart;
                    break;
                default:
                    console.log("Invalid tense!");
            }
        }
        else if (this.voice == 1)			//passive
        {
            switch (tense) {
                case 0:
                    verbPhrase = EnglToBe.Mood[0].Tense[0].Person[this.person] + " being " + this.lexis.EnglPastPart;
                    break;
                case 1:
                    verbPhrase = EnglToBe.Mood[0].Tense[1].Person[this.person] + " being " + this.lexis.EnglPastPart;
                    break;
                case 2:
                    verbPhrase = "will be " + this.lexis.EnglPastPart;
                    break;
                case 3:
                    verbPhrase = EnglToBe.Mood[0].Tense[1].Person[this.person] + " " + this.lexis.EnglPastPart;
                    break;
                case 4:
                    verbPhrase = "had been " + this.lexis.EnglPastPart;
                    break;
                case 5:
                    verbPhrase = "will have been " + this.lexis.EnglPastPart;
                    break;
                default:
                    console.log("Invalid tense!");
            }
        }

        this.englTrans = (pronoun + " " + verbPhrase);
    }

    return this.englTrans;
};

function getParsePersonString(person, number)
{
    if (number != undefined && person < 3)
        person = number?person+3:person;

    return PersonList[person];
}

function getParseTenseString(tense, aspect)
{
    if (aspect != undefined && tense < 3)
        tense = aspectToTense(aspect, tense);

    if (tense >= 0 && tense < 6)
        return TenseList[tense];
    else
        return "invalid tense (" + tense + ")";
}

function getParseVoiceString(voice)
{
    if (voice>=0 && voice < 2)
        return VoiceList[voice];
    else
        return "invalid voice (" + voice + ")";
}

function getParseMoodString(mood)
{
    if (mood >= 0 && mood < 4)
        return MoodList[mood];
    else
        return "invalid mood (" + mood + ")";
}

Verb.prototype.getParseInfo = function() {
    if (this.parseInfo == undefined)
    {

        var voice = getParseVoiceString(this.voice);

        var mood = getParseMoodString(this.mood);

        var person, tense;

        if (this.mood == 0 || this.mood == 1)
        {
            person = getParsePersonString(this.person);

            tense = getParseTenseString(this.tense, this.aspect);

            this.parseInfo = (person + " " + tense + " " + voice + " " + mood);
        }
        else if (this.mood == 2)		//infinitive
        {
            switch (this.tense)
            {
                case 0:
                    tense = "present";
                    break;
                case 1:
                    tense = "perfect";
                    break;
                case 2:
                    tense = "future";
                    break;
                default:
                    tense = "invalid tense";
            }

            this.parseInfo = (tense + " " + voice + " " + mood);
        }
        else
        {
            return ("Currently invalid mood (" + Verb.mood + ") for getParseInfo()");
        }

    }
    return this.parseInfo;
};

///////////////////
//end Verb class
///////////////////
module.exports = verbGrammar;

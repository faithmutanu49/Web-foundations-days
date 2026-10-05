let notes = [
    {id:1,text:"Buy milk and bread",category:"personal"},
    {id:2,text:"Finish the day 3 assignment",category:"study"},
    {id:3,text:"Email the project report to Grace",category:"work"},
    {id:4,text:"Revise JavaScript arrays",category:"study"},
    {id:5,text:"Call mum",category:"personal"}
    ];
    function searchNotes(word){
        const searchWord = word.toLowerCase();
        return notes.filter(note => note.text.toLowerCase().includes(searchWord));
    }
    function longestNote(){
        if(notes.length ===0){
            return null;
        }
        let longest = notes[0];
        for(let i=1;i<notes.length;i++){
            if(notes[i].text.length>longest.text.length)
            {
                longest = notes[i];
            }
        }
        return longest;
    }
    function countByCategory(){
        const counts = {}
        for(const note of notes){
            if( counts[note.category]){
                counts[note.category]++;
            }else{
                counts[note.category]=1;
            }
        }
        return counts;
    }
    function getSummary(){
        const counts = countByCategory();
        const total =notes.length;
        const word = total === 1?"note":"notes";
        return '${total}${word}:${counts.personal||0}personal,${counts.work||0}work,${counts.study||0}study.';
    }
    function isDuplicate(text){
        const normalisedText = text
        .trim()
        .replace(/\s+/g,"")
        .toLowerCase();
        return notes.some(note=>note.text
            .trim()
            .replace(/\s+/g,"")
            .toLowerCase()===normalisedText
        );
    }
    function addNote(text,category){
        const cleanedText= text.trim();
        const validCategories = ["personal","work","study"];
        if (cleanedText.length<1||cleanedText. length>200){
            console.log("Note was not added:text must be between 1 and 200 characters.");
            return false;
        }
        if (isDuplicate(cleanedText)){
            console.log("Note was not added: duplicate notes.");
            return false;
        }
        if(!validCategories.includes(category)){
            console.log("Note was not added:Invalid Category");
            return false;
        }
        const newNote= {
            id:notes.length + 1,
            text:cleanedText,
            category:category
        };
        notes.push(newNote);
        console.log("Note added succeccfully.");
        return true;
        }

        // =============================
// TESTS
// =============================

// searchNotes()
console.log("Search test 1:", searchNotes("JavaScript"));
// Expected: array containing note 4

console.log("Search test 2:", searchNotes("football"));
// Expected: []


// longestNote()
console.log("Longest note test 1:", longestNote());
// Expected: note 3, "Email the project report to Grace"

let savedNotes = notes;
notes = [];

console.log("Longest note test 2:", longestNote());
// Expected: null

notes = savedNotes;


// countByCategory()
console.log("Category count test 1:", countByCategory());
// Expected: { personal: 2, study: 2, work: 1 }

savedNotes = notes;
notes = [];

console.log("Category count test 2:", countByCategory());
// Expected: {}

notes = savedNotes;


// getSummary()
console.log("Summary test 1:", getSummary());
// Expected: "5 notes: 2 personal, 1 work, 2 study."

savedNotes = notes;
notes = [
    { id: 1, text: "Test note", category: "personal" }
];

console.log("Summary test 2:", getSummary());
// Expected: "1 note: 1 personal, 0 work, 0 study."

notes = savedNotes;


// isDuplicate()
console.log("Duplicate test 1:", isDuplicate("Call mum"));
// Expected: true

console.log("Duplicate test 2:", isDuplicate("  CALL   MUM  "));
// Expected: true


// addNote()
console.log("Add note test 1:", addNote("Buy a new notebook", "personal"));
// Expected: true

console.log("Add note test 2:", addNote("Learn Python", "coding"));
// Expected: false
// Expected reason: invalid category

console.log("Add note test 3:", addNote("  CALL   MUM  ", "personal"));
// Expected: false
        
        
        
    
        
    
            
            
        
    
            
    
        
    
    

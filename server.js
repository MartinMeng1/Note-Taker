const {
    readFromFile,
    readAndAppend,
    writeToFile
  } = require("./helpers/fshelper");

const express = require('express');
const path = require('path');
const { v4: uuidv4 } = require('uuid')

const PORT = process.env.PORT || 3001;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.get('/notes',(req,res)=>{
    res.sendFile(path.join(__dirname, '/public/notes.html'));
});

app.get('*',(req,res)=>{
    res.sendFile(path.join(__dirname,'/public/index.html'));
});

app.get('/api/notes',(req,res)=>{
    readFromFile('./db/db.json',(err,data)=>{
        if(err){
            console.error(err);
           res.status(500).json({error: 'Unable to read from file'});
           return
        }
        else{
            const notes = JSON.parse(data);
            res.json(notes);
        }
    })
});

app.post('/api/notes',(req,res)=>{
    const{noteId,title,text} = req.body;

    if(title&&text){
        const newNotes={
            title,
            text,
            noteId:uuidv4(),
        };

    readAndAppend(newNotes,'./db/db.json');

    const response = {
        status: 'success',
        body: newNotes,
      };
  
      res.json(response)
    }
     else
      {
      res.json('Error in posting newNotes');
    }
});

app.delete('/api/notes/:id', (req, res) => {
    const noteId = req.params.id;

    readFromFile('./db/db.json',(err,data)=>{
        if(err){
        console.error(err);
        res.status(500).json({ error: 'Unable to read from file' });
        return;}

        const notes=JSON.parse(data);
        //Find the index of the note object that matches the ID of the paramater.
        const index= notes.findIndex((note)=>note.noteID === noteID);

        if (index === -1) {
            // Note not found
            callback(new Error('Note not found'));
            return;
          }

        notes.splice(index,1);

        writeToFile('./db/db.json',notes);

        res.json({ status: 'success', message: 'Note deleted successfully' });
    })
})



app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT} 🚀`)
);
    

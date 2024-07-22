import { Router } from "express";
import { promises as fs } from 'fs';
import { fileURLToPath  } from "url";
import path from 'path';

const routerDirectores = Router();
const _filename = fileURLToPath(import.meta.url);
const _dirname = path.dirname(_filename)


const dataFilePath = path.join(_dirname, "../../data/directores.json");

const readDirectoresFs = async () => {
    try{
        const data = await fs.readFile(dataFilePath)
        const dataJson = JSON.parse(data);
        const directores = dataJson.directores
        return directores;
    }catch(err){
        throw new Error(`Error en la promesa ${err}`)
    }
};

const writeDirectoresFs = async (directores) => {
    await fs.writeFile(dataFilePath, JSON.stringify(directores, null, 2));
};

routerDirectores.post("/postDirectores", async (req, res) => {
    const directores = await readDirectoresFs();
    const newDirector = {
        id: directores.length + 1,
        name: req.body.name,
    };
    console.log(newDirector)
    directores.push(newDirector);
    await writeDirectoresFs({"directores": directores});
    res.status(201).json({
        message: "Director creado exitosamente",
        director: newDirector
    });
});

routerDirectores.get("/", async (req, res) => {
    const directores = await readDirectoresFs()
    res.json(directores);
});

routerDirectores.get("/directoresId", async (req, res) => {
    const directores = await readDirectoresFs();
    console.log(req)
    const anime = directores.find(a => a.id === parseInt(req.query.id));
    if(!anime) return res.status(404).send("Anime not found");
    res.json(anime)
});

routerDirectores.put("/updateDirectores", async (req, res) => {
    const directores = await readDirectoresFs();
    
    console.log(req.query.id, "aquii")
    const indexDirector = directores.findIndex(a => a.id === parseInt(req.query.id));
    console.log(indexDirector, "aquiii")
    console.log(directores, "aquiiii")
    if(indexDirector === -1) return res.status(404).send("Director not found");
    const updateDirector = {
        ...directores[indexDirector],
        name: req.body.name
    }
    directores[indexDirector] = updateDirector;
    await writeDirectoresFs({"directores": directores});
    res.send(`Director update successfully ${JSON.stringify(updateDirector)}`)
});

routerDirectores.delete('/deleteDirectores', async (req,res)=>{
    const directores = await readDirectoresFs();
    const DirectorIndex = directores.findIndex(Director => Director.id === parseInt(req.query.id))
    if(directores === -1) return res.status(404).send('Director not found')
        const deleteDirector = directores.splice(DirectorIndex,1)
        await writeDirectoresFs(deleteDirector)
        res.send('The Director has been deleted')


})

export default routerDirectores;




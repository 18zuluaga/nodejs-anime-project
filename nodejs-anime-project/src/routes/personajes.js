import { Router } from "express";
import { promises as fs } from 'fs';
import { fileURLToPath  } from "url";
import path from 'path';

const routerPersonajes = Router();
const _filename = fileURLToPath(import.meta.url);
const _dirname = path.dirname(_filename)


const dataFilePath = path.join(_dirname, "../../data/personajes.json");

const readPersonajesFs = async () => {
    try{
        const data = await fs.readFile(dataFilePath)
        const dataJson = JSON.parse(data);
        const personajes = dataJson.personajes
        return personajes;
    }catch(err){
        throw new Error(`Error en la promesa ${err}`)
    }
};

const writePersonajesFs = async (personajes) => {
    await fs.writeFile(dataFilePath, JSON.stringify(personajes, null, 2));
};

routerPersonajes.post("/postPersonaje", async (req, res) => {
    const personajes = await readPersonajesFs();
    const newPeronaje = {
        id: personajes.length + 1,
        title: req.body.title,
        genre: req.body.genre,
        studioId: req.body.studioId
    };

    personajes.push(newPeronaje);
    await writePersonajesFs({"personajes": personajes});
    res.status(201).json({
        message: "Peronaje creado exitosamente",
        peronaje: newPeronaje
    });
});

routerPersonajes.get("/", async (req, res) => {
    const personajes = await readPersonajesFs()
    res.json(personajes);
});

routerPersonajes.get("/personajeId", async (req, res) => {
    const personajes = await readPersonajesFs();
    const personaje = personajes.find(a => a.id === parseInt(req.query.id));
    if(!personaje) return res.status(404).send("Personaje not found");
    res.json(personaje)
});

routerPersonajes.put("/updatePersonaje", async (req, res) => {
    const personajes = await readPersonajesFs();
    const indexPersonaje = personajes.findIndex(a => a.id === parseInt(req.query.id));
    if(indexPersonaje === -1) return res.status(404).send("Personaje not found");
    const updatePersonaje = {
        ...personajes[indexPersonaje],
        title: req.body.title,
        genre: req.body.genre
    }

    personajes[indexPersonaje] = updatePersonaje;
    await writePersonajesFs({"personajes": personajes});
    res.send(`Personaje update successfully ${JSON.stringify(updatePersonaje)}`)
});

routerPersonajes.delete('/deletePersonaje', async (req,res)=>{
    const personajes = await readPersonajesFs();
    const peronajeIndex = personajes.findIndex(peronaje => peronaje.id === parseInt(req.query.id))
    if(personajes === -1) return res.status(404).send('Personaje not found')
        const deletePersonaje = personajes.splice(peronajeIndex,1)
        await writePersonajesFs(deletePersonaje)
        res.send('The personaje has been deleted')


})

export default routerPersonajes;




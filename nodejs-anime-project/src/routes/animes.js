import { Router } from "express";
import { promises as fs } from 'fs';
import { fileURLToPath  } from "url";
import path from 'path';

const routerAnime = Router();
const _filename = fileURLToPath(import.meta.url);
const _dirname = path.dirname(_filename)


const dataFilePath = path.join(_dirname, "../../data/animes.json");

const readAnimesFs = async () => {
    try{
        const data = await fs.readFile(dataFilePath)
        const dataJson = JSON.parse(data);
        const animes = dataJson.animes
        return animes;
    }catch(err){
        throw new Error(`Error en la promesa ${err}`)
    }
};

const writeAnimesFs = async (animes) => {
    await fs.writeFile(dataFilePath, JSON.stringify(animes, null, 2));
};

routerAnime.post("/postAnimes", async (req, res) => {
    const animes = await readAnimesFs();
    const newAnime = {
        id: animes.length + 1,
        title: req.body.title,
        genre: req.body.genre,
        studioId: req.body.studioId
    };

    animes.push(newAnime);
    await writeAnimesFs({"animes": animes});
    res.status(201).json({
        message: "Anime creado exitosamente",
        anime: newAnime
    });
});

routerAnime.get("/", async (req, res) => {
    const animes = await readAnimesFs()
    res.json(animes);
});

routerAnime.get("/animeId", async (req, res) => {
    const animes = await readAnimesFs();
    console.log(req)
    const anime = animes.find(a => a.id === parseInt(req.query.id));
    if(!anime) return res.status(404).send("Anime not found");
    res.json(anime)
});

routerAnime.put("/updateAnime", async (req, res) => {
    const animes = await readAnimesFs();
    const indexAnime = animes.findIndex(a => a.id === parseInt(req.query.id));
    if(indexAnime === -1) return res.status(404).send("Anime not found");
    const updateAnime = {
        ...animes[indexAnime],
        title: req.body.title,
        genre: req.body.genre
    }

    animes[indexAnime] = updateAnime;
    await writeAnimesFs({"animes": animes});
    res.send(`Anime update successfully ${JSON.stringify(updateAnime)}`)
});

routerAnime.delete('/deleteAnime', async (req,res)=>{
    const animes = await readAnimesFs();
    const animeIndex = animes.findIndex(anime => anime.id === parseInt(req.query.id))
    if(animes === -1) return res.status(404).send('Anime not found')
        const deleteAnime = animes.splice(animeIndex,1)
        await writeAnimesFs(deleteAnime)
        res.send('The anime has been deleted')


})

export default routerAnime;




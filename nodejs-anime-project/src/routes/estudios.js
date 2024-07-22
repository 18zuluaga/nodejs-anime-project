import { Router } from "express";
import { promises as fs } from 'fs';
import { fileURLToPath  } from "url";
import path from 'path';

const routerEstudios = Router();
const _filename = fileURLToPath(import.meta.url);
const _dirname = path.dirname(_filename)


const dataFilePath = path.join(_dirname, "../../data/estudios.json");

const readEstudiosFs = async () => {
    try{
        const data = await fs.readFile(dataFilePath)
        const dataJson = JSON.parse(data);
        const estudios = dataJson.estudios
        return estudios;
    }catch(err){
        throw new Error(`Error en la promesa ${err}`)
    }
};

const writeEstudiosFs = async (estudios) => {
    await fs.writeFile(dataFilePath, JSON.stringify(estudios, null, 2));
};

routerEstudios.post("/postEstudios", async (req, res) => {
    const estudios = await readEstudiosFs();
    const newEstudio = {
        id: estudios.length + 1,
        name: req.body.name,
    };

    estudios.push(newEstudio);
    await writeEstudiosFs({"estudios": estudios});
    res.status(201).json({
        message: "Estudio creado exitosamente",
        estudio: newEstudio
    });
});

routerEstudios.get("/", async (req, res) => {
    const Estudio = await readEstudiosFs()
    res.json(Estudio);
});

routerEstudios.get("/estudiosId", async (req, res) => {
    const estudios = await readEstudiosFs();
    console.log(req)
    const estudio = estudios.find(a => a.id === parseInt(req.query.id));
    if(!estudio) return res.status(404).send("Estudio not found");
    res.json(estudio)
});

routerEstudios.put("/updateEstudios", async (req, res) => {
    const estudios = await readEstudiosFs();
    const indexEstudio = estudios.findIndex(a => a.id === parseInt(req.query.id));
    if(indexEstudio === -1) return res.status(404).send("Estudio not found");
    const updateEstudio = {
        ...estudios[indexEstudio],
        name: req.body.name
    }

    estudios[indexEstudio] = updateEstudio;
    await writeEstudiosFs({"estudios": estudios});
    res.send(`Estudio update successfully ${JSON.stringify(updateEstudio)}`)
});

routerEstudios.delete('/deleteEstudios', async (req,res)=>{
    const estudios = await readEstudiosFs();
    const estudioIndex = estudios.findIndex(estudio => estudio.id === parseInt(req.query.id))
    if(estudios === -1) return res.status(404).send('Estudio not found')
        const deleteEstudio = estudios.splice(estudioIndex,1)
        await writeEstudiosFs(deleteEstudio)
        res.send('The estudio has been deleted')


})

export default routerEstudios;




const {response} = require('express');
const Evento = require('../models/Evento');


const getEventos = async(req, res = response) => {

    const eventos = await Evento.find().populate('user','name');

    res.json({
        ok: true,
        eventos
    })
}
const crearEvento = async (req, res = response) => {

    const evento = new Evento(req.body);

    try {
        evento.user = req.uid;
        const eventoGuardado = await evento.save();
        console.log(req.body);

        res.json({
            ok: true,
            evento: eventoGuardado
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador...'
        });
    }
};


const actualizarEvento = async(req, res = response) => {

    const eventoId = req.params.id;
    const uid = req.uid;

    try {

        const evento = await Evento.findById(eventoId);

        if(!evento){
            return res.status(404).json({
                ok:false,
                msg:'Evento no existe por ese id'
            })
        }
        if(evento.user.toString() !== uid){
            return res.status(401).json({
                ok:false,
                msg:'No tiene permiso de editar este evento'
            });

        }
        const nuevoEvento = {
            ...req.body,
            user: uid,
        }

        const eventoActualizado = await Evento.findByIdAndUpdate(eventoId,nuevoEvento,{new:true});

        res.json({
            ok:true,
            evento:eventoActualizado
        })


    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok:false,
            msg:'Hable con el administrador'
        })
    }

    res.json({
        ok: true,
        eventoId
    })
}



const elimiarEvento = async (req, res = response) => {
    const eventoId = req.params.id;
    const uid = req.uid;

    try {
        const evento = await Evento.findById(eventoId);

        if (!evento) {
            return res.status(404).json({
                ok: false,
                msg: 'Evento no existe por ese id'
            });
        }

        // Verificar si el usuario tiene permiso
        if (evento.user.toString() !== uid) {
            return res.status(401).json({
                ok: false,
                msg: 'No tiene permiso de eliminar este evento'
            });
        }

        // Esperar a que la operación de eliminación termine
        await Evento.findByIdAndDelete(eventoId);

        // Enviar la respuesta de éxito
        return res.json({
            ok: true,
            msg: 'Evento eliminado',
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        });
    }
};

module.exports = {
    getEventos,
    crearEvento,
    actualizarEvento,
    elimiarEvento
}
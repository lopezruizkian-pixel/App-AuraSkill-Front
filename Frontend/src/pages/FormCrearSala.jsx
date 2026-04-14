import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Book, Users, Smile, Type, Clock } from "lucide-react";

const FormCrearSala = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        titulo: "",
        habilidad: "",
        mood: "",
        capacidad: 10,
        duracion: 60,
        descripcion: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch("/api/create-room", { // Replace with your actual API endpoint
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                // Redirect to active rooms or update active rooms state
                navigate("/salas-activas");
            } else {
                console.error("Error creating room:", response.status);
            }
        } catch (error) {
            console.error("Error creating room:", error);
        }
    };

    return (
        <div className="form-crear-sala-container">
            <form className="formulario-sala" onSubmit={handleSubmit}>
                <div className="input-group-neon">
                    <label htmlFor="titulo">Título de la sala</label>
                    <div className="input-wrapper">
                        <Type className="input-icon" size={20} />
                        <input type="text" id="titulo" name="titulo" value={formData.titulo} onChange={handleChange} placeholder="Ej: React Avanzado" required />
                    </div>
                </div>

                <div className="input-group-neon">
                    <label htmlFor="habilidad">Habilidad</label>
                    <div className="input-wrapper">
                        <Book className="input-icon" size={20} />
                        <input type="text" id="habilidad" name="habilidad" value={formData.habilidad} onChange={handleChange} placeholder="Ej: Programación" required />
                    </div>
                </div>

                <div className="input-group-neon">
                    <label htmlFor="capacidad">Capacidad</label>
                    <div className="input-wrapper">
                        <Users className="input-icon" size={20} />
                        <input type="number" id="capacidad" name="capacidad" value={formData.capacidad} onChange={handleChange} placeholder="Ej: 10" required />
                    </div>
                </div>

                <div className="form-action-right">
                    <button type="submit" className="primary-btn-neon btn-crear-sala">Crear Sala</button>
                </div>
            </form>
        </div>
    );
};

export default FormCrearSala;
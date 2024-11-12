package crud_tareas.dto;

import java.io.Serializable;

//import jakarta.persistence.Column;

public class ProyectoDto implements Serializable {
	/**
	 * *
	 */
	
	private static final long serialVersionUID = 1L;
	
	private String nombre;
	private String descripcion;

	public String getNombre() {
		return nombre;
	}

	public void setNombre(String nombre) {
		this.nombre = nombre;
	}

	public String getDescripcion() {
		return descripcion;
	}

	public void setDescripcion(String descripcion) {
		this.descripcion = descripcion;
	}
	
}
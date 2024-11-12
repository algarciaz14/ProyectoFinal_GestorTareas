package crud_tareas.dto;

import java.io.Serializable;

//import jakarta.persistence.Column;

public class DepartamentoDto implements Serializable {
	/**
	 * *
	 */
	
	private static final long serialVersionUID = 1L;
	
	private String nombre;

	public String getNombre() {
		return nombre;
	}

	public void setNombre(String nombre) {
		this.nombre = nombre;
	}
	
}
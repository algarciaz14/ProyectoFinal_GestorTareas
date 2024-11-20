package crud_tareas.dto;

import java.io.Serializable;

public class DepartamentoDto implements Serializable {
	/**
	 * *
	 */
	
	private static final long serialVersionUID = 1L;
	
	private Long id;
	
	private String nombre;

	public String getNombre() {
		return nombre;
	}

	public void setNombre(String nombre) {
		this.nombre = nombre;
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}
	
}
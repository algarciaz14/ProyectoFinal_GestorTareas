package crud_tareas.dto;

import java.io.Serializable;
import java.time.LocalDateTime;
//import java.util.Date;

//import jakarta.persistence.Column;

public class TareaDto implements Serializable {
	/**
	 * *
	 */
	
	private static final long serialVersionUID = 1L;
	
	private String nombre;
	private String prioridad;
	private String estado;
	private Long proyectoId;
	private Long responsableId;
    private LocalDateTime createAt; // Para la fecha de registro
    private LocalDateTime createAtc; // Para la fecha de cierre
	
	
	
	public String getNombre() {
		return nombre;
	}
	public void setNombre(String nombre) {
		this.nombre = nombre;
	}
	public String getPrioridad() {
		return prioridad;
	}
	public void setPrioridad(String prioridad) {
		this.prioridad = prioridad;
	}
	public String getEstado() {
		return estado;
	}
	public void setEstado(String estado) {
		this.estado = estado;
	}
	
	public LocalDateTime getCreateAt() {
		return createAt;
	}
	public void setCreateAt(LocalDateTime createAt) {
		this.createAt = createAt;
	}
	public LocalDateTime getCreateAtc() {
		return createAtc;
	}
	public void setCreateAtc(LocalDateTime createAtc) {
		this.createAtc = createAtc;
	}
	public Long getProyectoId() {
		return proyectoId;
	}
	public void setProyectoId(Long proyectoId) {
		this.proyectoId = proyectoId;
	}
	public Long getResponsableId() {
		return responsableId;
	}
	public void setResponsableId(Long responsableId) {
		this.responsableId = responsableId;
	}
}
package crud_tareas.dto;

import java.io.Serializable;


public class ResponsableDto implements Serializable {
	/**
	 * *
	 */
	
	private static final long serialVersionUID = 1L;
	
	private String nombre;
	private String apellido;
	private String correo;
	private Long celular;
	private DepartamentoDto departamento;
	private PuestoDto puesto;
	public String getNombre() {
		return nombre;
	}
	public void setNombre(String nombre) {
		this.nombre = nombre;
	}
	public String getApellido() {
		return apellido;
	}
	public void setApellido(String apellido) {
		this.apellido = apellido;
	}
	public String getCorreo() {
		return correo;
	}
	public void setCorreo(String correo) {
		this.correo = correo;
	}
	public Long getCelular() {
		return celular;
	}
	public void setCelular(Long celular) {
		this.celular = celular;
	}
	public DepartamentoDto getDepartamento() {
		return departamento;
	}
	public void setDepartamento(DepartamentoDto departamento) {
		this.departamento = departamento;
	}
	public PuestoDto getPuesto() {
		return puesto;
	}
	public void setPuesto(PuestoDto puesto) {
		this.puesto = puesto;
	}
	
	
	
}
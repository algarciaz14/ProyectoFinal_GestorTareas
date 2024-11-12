package crud_tareas.entity;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

//import java.util.Date;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

@Entity
@Table (name = "responsables")
public class Responsable {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	@Column (name="nombreResponsable")
	private String nombre;
	@Column (name="apellidoResponsable")
	private String apellido;
	private String correo;
	private Long celular;
	
	@ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="departamento_id")
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private Departamento departamento; // Relación con Departamento
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "puesto_id")
    @JsonIgnore // Ignorar el "puesto" para evitar ciclos
    private Puesto puesto; // Relación con Puesto

    @OneToMany(mappedBy = "responsable")
    private List<Tarea> tareas; // Relación con Tarea
    
   

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

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

	public Departamento getDepartamento() {
		return departamento;
	}

	public void setDepartamento(Departamento departamento) {
		this.departamento = departamento;
	}

	public Puesto getPuesto() {
		return puesto;
	}

	public void setPuesto(Puesto puesto) {
		this.puesto = puesto;
	}

	public List<Tarea> getTareas() {
		return tareas;
	}

	public void setTareas(List<Tarea> tareas) {
		this.tareas = tareas;
	}
	
	}
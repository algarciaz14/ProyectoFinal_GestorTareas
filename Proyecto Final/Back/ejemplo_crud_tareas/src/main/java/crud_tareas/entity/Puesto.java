package crud_tareas.entity;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

//import java.util.Date;

//import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
//import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
//import jakarta.persistence.JoinColumn;
//import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table (name = "puestos")
public class Puesto {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	@Column (name="nombrePuesto")
	private String nombre;
	// Relación One-to-Many con Responsable
    @OneToMany(mappedBy = "puesto")
    @JsonIgnoreProperties({"puesto"}) // Ignorar la propiedad "puesto" de Responsable para evitar el ciclo
    private List<Responsable> responsables;
    
   
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
	public List<Responsable> getResponsables() {
		return responsables;
	}
	public void setResponsables(List<Responsable> responsables) {
		this.responsables = responsables;
	}
	
	
}
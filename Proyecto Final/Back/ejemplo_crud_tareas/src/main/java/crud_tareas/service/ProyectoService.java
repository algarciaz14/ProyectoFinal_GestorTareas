package crud_tareas.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import crud_tareas.dto.ProyectoDto;
import crud_tareas.entity.Proyecto;
import crud_tareas.repository.IProyectoRepository;


@Service
public class ProyectoService {
	
	@Autowired
	private IProyectoRepository proyectoRepository;
	
	//Filtro nombre
	public List<Proyecto> findByNombre(String nombre) {
		return proyectoRepository.findByNombreContaining(nombre);
	}
	
	//Filtro descripcion
	public List<Proyecto> findByDescripcion(String descripcion) {
		return proyectoRepository.findByDescripcionContaining(descripcion);
	}
		
	
	//Consulta de todos los proyectos
	@Transactional(readOnly = true)
	public List<Proyecto> findAll(){
		return (List<Proyecto>)proyectoRepository.findAll();
		
	}
	
	//Consulta por ID
	@Transactional(readOnly = true)
	public Proyecto findById(Long id) {
		return (Proyecto) proyectoRepository.findById(id).orElse(null);
	}
	
	//Crear nuevo proyecto
	@Transactional
	public Proyecto createProyecto (ProyectoDto proyecto) {
		Proyecto proyectoEntity= new Proyecto();
		proyectoEntity.setNombre(proyecto.getNombre());
		proyectoEntity.setDescripcion(proyecto.getDescripcion());
		
	    return proyectoRepository.save(proyectoEntity);
	}

	
	//Eliminar proyecto
	@Transactional
	public void delete (Long id) {
		proyectoRepository.deleteById(id);
	}
	
	
	//Actualizar proyecto
	@Transactional
	public Proyecto updateProyecto(Proyecto proyecto) {
	    // Guardar el proyecto actualizado en la base de datos
	    return proyectoRepository.save(proyecto); //
	}
}
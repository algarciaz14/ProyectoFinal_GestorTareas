package crud_tareas.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


import crud_tareas.dto.TareaDto;
import crud_tareas.entity.Tarea;
import crud_tareas.entity.Responsable; 
import crud_tareas.entity.Proyecto; 
import crud_tareas.repository.ITareaRepository;



@Service
public class TareaService {
	
	@Autowired
	private ITareaRepository tareaRepository;
	
	@Autowired
	private ResponsableService responsableService; 

	@Autowired
	private ProyectoService proyectoService; 
	


	public List<Tarea> findAllWithResponsable() {
	    return tareaRepository.findAllWithResponsable();
	}

	
	//Consulta de todas las tareas
	@Transactional(readOnly = true)
	public List<Tarea> findAll(){
		return (List<Tarea>)tareaRepository.findAll();
		
	}
	
	//Consulta por ID
	@Transactional(readOnly = true)
	public Tarea findById(Long id) {
		return (Tarea) tareaRepository.findById(id).orElse(null);
	}
	
	@Transactional
	public Tarea createTarea (TareaDto tarea) {
	    Tarea tareaEntity = new Tarea();
	    tareaEntity.setNombre(tarea.getNombre());
	    tareaEntity.setPrioridad(tarea.getPrioridad());

	    // Buscar responsable y establecerlo
	    if (tarea.getResponsableId() != null) {
	        Responsable responsable = responsableService.findById(tarea.getResponsableId());
	        if (responsable != null) {
	            tareaEntity.setResponsable(responsable);
	        } else {
	            throw new RuntimeException("Responsable no encontrado con ID: " + tarea.getResponsableId());
	        }
	    }

	    // Buscar proyecto y establecerlo
	    if (tarea.getProyectoId() != null) {
	        Proyecto proyecto = proyectoService.findById(tarea.getProyectoId());
	        if (proyecto != null) {
	            tareaEntity.setProyecto(proyecto);
	        } else {
	            throw new RuntimeException("Proyecto no encontrado con ID: " + tarea.getProyectoId());
	        }
	    }

	    tareaEntity.setEstado(tarea.getEstado());
	    tareaEntity.setCreateAt(LocalDateTime.now());

	    // Solo establecer la fecha de cierre si está disponible
	    if (tarea.getCreateAtc() != null) {
	        tareaEntity.setCreateAtc(tarea.getCreateAtc());
	    } else {
	        tareaEntity.setCreateAtc(null); 
	    }

	    return tareaRepository.save(tareaEntity);
	}

	
	//Eliminar tarea
	@Transactional
	public void delete (Long id) {
		tareaRepository.deleteById(id);
	}
	
	
	//Actualizar tarea
	@Transactional
	public Tarea updateTarea(Tarea tarea) {
	    // Guardar la tarea actualizada en la base de datos
	    return tareaRepository.save(tarea); //
	}
	
	

	
}
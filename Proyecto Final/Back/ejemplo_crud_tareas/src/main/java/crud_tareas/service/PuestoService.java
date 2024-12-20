package crud_tareas.service;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import crud_tareas.dto.PuestoDto; 
import crud_tareas.entity.Puesto;
import crud_tareas.repository.IPuestoRepository;


@Service
public class PuestoService {
	
	@Autowired
	private IPuestoRepository puestoRepository;
	
	//Filtro
		public List<Puesto> findByNombre(String nombre) {
	        return puestoRepository.findByNombreContaining(nombre);
	    }
	
	//Consulta de todos los puestos
	@Transactional(readOnly = true)
	public List<Puesto> findAll(){
		return (List<Puesto>)puestoRepository.findAll();
		
	}
	
	//Consulta por ID
	@Transactional(readOnly = true)
	public Puesto findById(Long id) {
		return (Puesto) puestoRepository.findById(id).orElse(null);
	}
	
	//Crear nuevo puesto
	@Transactional
	public Puesto createPuesto (PuestoDto puesto) {
		Puesto puestoEntity= new Puesto();
		puestoEntity.setNombre(puesto.getNombre());



	    return puestoRepository.save(puestoEntity);
	}

	
	//Eliminar puesto
	@Transactional
	public void delete (Long id) {
		puestoRepository.deleteById(id);
	}
	
	//Actualizar puesto
	@Transactional
	public Puesto updatePuesto(Puesto puesto) {
	    // Guardar el puesto actualizado en la base de datos
	    return puestoRepository.save(puesto); //
	}
}
package crud_tareas.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import crud_tareas.dto.ResponsableDto;
import crud_tareas.entity.Departamento;
import crud_tareas.entity.Puesto;
import crud_tareas.entity.Responsable;
import crud_tareas.repository.IResponsableRepository;

@Service
public class ResponsableService {
	
	@Autowired
	private IResponsableRepository responsableRepository;
	
	 @Autowired
	 private PuestoService puestoService;  
	 
	 @Autowired
	 private DepartamentoService departamentoService; 
	
	//Consulta de todos los responsables
	@Transactional(readOnly = true)
	public List<Responsable> findAll(){
		return (List<Responsable>)responsableRepository.findAll();
		
	}
	
	//Consulta por ID
	@Transactional(readOnly = true)
	public Responsable findById(Long id) {
		return (Responsable) responsableRepository.findById(id).orElse(null);
	}
	
	// Crear nuevo responsable
    @Transactional
    public Responsable createResponsable(ResponsableDto responsableDto) {
        Responsable responsableEntity = new Responsable();
        responsableEntity.setNombre(responsableDto.getNombre());
        responsableEntity.setApellido(responsableDto.getApellido());
        responsableEntity.setCorreo(responsableDto.getCorreo());
        responsableEntity.setCelular(responsableDto.getCelular());

        // Obtener el departamento y el puesto a partir de sus IDs
        if (responsableDto.getDepartamento() != null) {
            Departamento departamento = departamentoService.findById(responsableDto.getDepartamento());
            responsableEntity.setDepartamento(departamento); 
        }

        if (responsableDto.getPuesto() != null) {
            Puesto puesto = puestoService.findById(responsableDto.getPuesto());
            responsableEntity.setPuesto(puesto); 
        }

        return responsableRepository.save(responsableEntity); // Guardar el responsable en la base de datos
    }

	
	//Eliminar responsable
	@Transactional
	public void delete (Long id) {
		responsableRepository.deleteById(id);
	}
	
	
	@Transactional
	public Responsable updateResponsable(Responsable responsable) {
	    // Guardar el responsable en la base de datos
	    return responsableRepository.save(responsable); //
	}
}
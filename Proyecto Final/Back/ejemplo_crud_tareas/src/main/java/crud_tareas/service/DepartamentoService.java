package crud_tareas.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import crud_tareas.dto.DepartamentoDto;
import crud_tareas.entity.Departamento;
import crud_tareas.repository.IDepartamentoRepository;


@Service
public class DepartamentoService {
	
	@Autowired
	private IDepartamentoRepository departamentoRepository;
	
	//Consulta de todas los departamentos
	@Transactional(readOnly = true)
	public List<Departamento> findAll(){
		return (List<Departamento>)departamentoRepository.findAll();
		
	}
	
	//Consulta por ID
	@Transactional(readOnly = true)
	public Departamento findById(Long id) {
		return (Departamento) departamentoRepository.findById(id).orElse(null);
	}
	
	//Crear nuevo departamento
	@Transactional
	public Departamento createDepartamento (DepartamentoDto departamento) {
		Departamento departamentoEntity= new Departamento();
		departamentoEntity.setNombre(departamento.getNombre());


	    return departamentoRepository.save(departamentoEntity);
	}

	
	//Eliminar departamento
	@Transactional
	public void delete (Long id) {
		departamentoRepository.deleteById(id);
	}
	
	//Actualizar departamento
	@Transactional
	public Departamento updateDepartamento(Departamento departamento) {
	    // Guardar el departamento actualizado en la base de datos
	    return departamentoRepository.save(departamento); //
	}
}
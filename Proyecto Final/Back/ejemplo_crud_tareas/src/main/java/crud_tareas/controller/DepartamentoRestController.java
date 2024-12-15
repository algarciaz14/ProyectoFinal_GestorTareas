package crud_tareas.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import crud_tareas.dto.DepartamentoDto;
import crud_tareas.entity.Departamento;
import crud_tareas.service.DepartamentoService;

@CrossOrigin(origins= {"http://localhost:4200"})
@RestController
//@RequestMapping("/api")
@RequestMapping("/api/departamentos") 
public class DepartamentoRestController {
	
	@Autowired
	private DepartamentoService departamentoService;
	
	//Filtro
	@GetMapping("/filterByNombre")
    public List<Departamento> filterByNombre(@RequestParam String nombre) {
        return departamentoService.findByNombre(nombre);
    }
	
	//Crear un departamento
	@PostMapping("/create")
	    public ResponseEntity<?> createDepartamento(@RequestBody DepartamentoDto departamentoDto) {
	        Departamento departamentoNuevo;
	        Map<String, Object> response = new HashMap<>();

	        try {
	            departamentoNuevo = departamentoService.createDepartamento(departamentoDto);
	        } catch (DataAccessException e) {
	            response.put("mensaje", "Error al realizar el insert en la base de datos");
	            response.put("error", e.getMessage().concat(": ").concat(e.getMostSpecificCause().getMessage()));
	            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
	        }

	        response.put("mensaje", "Departamento creado con éxito, con el ID " + departamentoNuevo.getId());
	        response.put("proyecto", departamentoNuevo);
	        return new ResponseEntity<>(response, HttpStatus.CREATED);
	    }
 
	
	//Leer todas los departamentos
	@GetMapping("")
	@ResponseStatus(HttpStatus.OK)
	public List<Departamento> consulta(){
		return departamentoService.findAll();
	}
	
	
	
	//Obtener un departamento con id especifico 
	
	@GetMapping("/{id}")
	public ResponseEntity<?> consultaPorID(@PathVariable Long id){
		Departamento departamento = null;
		String response="";
		try {
			departamento = departamentoService.findById(id);
		} catch(DataAccessException e) {
			response= "Error al realizar la consulta.";
			response= response.concat(e.getMessage().concat(e.getMostSpecificCause().toString()));
			return new ResponseEntity<String>(response, HttpStatus.INTERNAL_SERVER_ERROR);
		}
		if(departamento == null)
		{
			response= "El departamento con el ID:".concat(id.toString()).concat("no existe en la base de datos");
			return new ResponseEntity<String>(response,HttpStatus.NOT_FOUND);
		}
		return new ResponseEntity<Departamento>(departamento,HttpStatus.OK);
	}
	
	
	//Eliminar el departamento del id especificado
	@DeleteMapping("/{id}")
	public ResponseEntity<?> delete(@PathVariable Long id){
		Map<String, Object> response = new HashMap<>();
		try {
			Departamento departamentoDelete = this.departamentoService.findById(id);
			if(departamentoDelete== null)
			{
				response.put("mensaje", "Error al eliminar. El departamento no existe en la base de datos");
				return new ResponseEntity<Map<String, Object>>(response, HttpStatus.INTERNAL_SERVER_ERROR);
			}
			
			departamentoService.delete(id);
		} catch (DataAccessException e) { 
			response.put("mensaje", "No se puede eliminar el departamento, porque ya tiene un responsable asignado");
			response.put("error", e.getMessage().concat(e.getMostSpecificCause().getLocalizedMessage()));
			return new ResponseEntity<Map<String, Object>>(response, HttpStatus.INTERNAL_SERVER_ERROR);
		}
		
		response.put("mensaje", "Departamento eliminado con éxito");
		return new ResponseEntity<Map<String,Object>>(response, HttpStatus.OK);
	}
	
	
	//Actualizar Departamento
	@PutMapping("/{id}")
	public ResponseEntity<?> update(@RequestBody DepartamentoDto departamentoDto, @PathVariable Long id) {
	    Map<String, Object> response = new HashMap<>();
	    
	    try {
	        // Verificamos si el departamento existe en la base de datos
	        Departamento departamentoActual = departamentoService.findById(id);
	        if (departamentoActual == null) {
	            response.put("mensaje", "Error: no se pudo editar, el departamento con ID: ".concat(id.toString()).concat(" no existe en la base de datos."));
	            return new ResponseEntity<Map<String, Object>>(response, HttpStatus.NOT_FOUND);
	        }

	        // Actualizamos solo los campos no nulos del departamento actual
	        if (departamentoDto.getNombre() != null) {
	            departamentoActual.setNombre(departamentoDto.getNombre());
	        }

	        // Guardamos el departamento actualizado en la base de datos
	        Departamento departamentoUpdated = departamentoService.updateDepartamento(departamentoActual); // Se llama al método que guarda el departamento actualizado

	        response.put("mensaje", "El departamento ha sido actualizado con éxito");
	        response.put("departamento", departamentoUpdated); // Regresamos el departamento actualizado
	        return new ResponseEntity<Map<String, Object>>(response, HttpStatus.OK);
	        
	    } catch (DataAccessException e) {
	        response.put("mensaje", "Error al actualizar el departamento en la base de datos");
	        response.put("error", e.getMessage().concat(": ").concat(e.getMostSpecificCause().getMessage()));
	        return new ResponseEntity<Map<String, Object>>(response, HttpStatus.INTERNAL_SERVER_ERROR);
	    }
	}

}

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
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;


import crud_tareas.dto.PuestoDto;

import crud_tareas.entity.Puesto;
import crud_tareas.service.PuestoService;

@CrossOrigin(origins= {"http://localhost:4200"})
@RestController
@RequestMapping("/api/puestos")
public class PuestoRestController {
	
	@Autowired
	private PuestoService puestoService;
	
	
	@PostMapping("/create")
	    public ResponseEntity<?> createPuesto(@RequestBody PuestoDto puestoDto) {
	        Puesto puestoNuevo;
	        Map<String, Object> response = new HashMap<>();

	        try {
	            puestoNuevo = puestoService.createPuesto(puestoDto);
	        } catch (DataAccessException e) {
	            response.put("mensaje", "Error al realizar el insert en la base de datos");
	            response.put("error", e.getMessage().concat(": ").concat(e.getMostSpecificCause().getMessage()));
	            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
	        }

	        response.put("mensaje", "Puesto creado con éxito, con el ID " + puestoNuevo.getId());
	        response.put("puesto", puestoNuevo);
	        return new ResponseEntity<>(response, HttpStatus.CREATED);
	    }
	
	//Leer todos los puestos
	@GetMapping("")
	@ResponseStatus(HttpStatus.OK)
	public List<Puesto> consulta(){
		return puestoService.findAll();
	}
	
	
	
	//Obtener un puesto con id especifico 
	
	@GetMapping("/{id}")
	public ResponseEntity<?> consultaPorID(@PathVariable Long id){
		Puesto puesto = null;
		String response="";
		try {
			puesto = puestoService.findById(id);
		} catch(DataAccessException e) {
			response= "Error al realizar la consulta.";
			response= response.concat(e.getMessage().concat(e.getMostSpecificCause().toString()));
			return new ResponseEntity<String>(response, HttpStatus.INTERNAL_SERVER_ERROR);
		}
		if(puesto == null)
		{
			response= "El puesto con el ID:".concat(id.toString()).concat("no existe en la base de datos");
			return new ResponseEntity<String>(response,HttpStatus.NOT_FOUND);
		}
		return new ResponseEntity<Puesto>(puesto,HttpStatus.OK);
	}
	
	
	//Eliminar el puesto del id especificado
	@DeleteMapping("/{id}")
	public ResponseEntity<?> delete(@PathVariable Long id){
		Map<String, Object> response = new HashMap<>();
		try {
			Puesto puestoDelete = this.puestoService.findById(id);
			if(puestoDelete== null)
			{
				response.put("mensaje", "Error al eliminar. El puesto no existe en la base de datos");
				return new ResponseEntity<Map<String, Object>>(response, HttpStatus.INTERNAL_SERVER_ERROR);
			}
			
			puestoService.delete(id);
		} catch (DataAccessException e) { 
			response.put("mensaje", "Error al eliminar en base de datos");
			response.put("error", e.getMessage().concat(e.getMostSpecificCause().getLocalizedMessage()));
			return new ResponseEntity<Map<String, Object>>(response, HttpStatus.INTERNAL_SERVER_ERROR);
		}
		
		response.put("mensaje", "Puesto eliminado con éxito");
		return new ResponseEntity<Map<String,Object>>(response, HttpStatus.OK);
	}
	
	
	
	//Actualizar Puesto
	@PutMapping("/{id}")
	public ResponseEntity<?> update(@RequestBody PuestoDto puestoDto, @PathVariable Long id) {
	    Map<String, Object> response = new HashMap<>();
	    
	    try {
	        // Verificamos si el puesto existe en la base de datos
	        Puesto puestoActual = puestoService.findById(id);
	        if (puestoActual == null) {
	            response.put("mensaje", "Error: no se pudo editar, el puesto ID: ".concat(id.toString()).concat(" no existe en la base de datos."));
	            return new ResponseEntity<Map<String, Object>>(response, HttpStatus.NOT_FOUND);
	        }

	        // Actualizamos solo los campos no nulos del puesto actual
	        if (puestoDto.getNombre() != null) {
	            puestoActual.setNombre(puestoDto.getNombre());
	        }
	     

	        // Guardamos el puesto actualizado en la base de datos
	        Puesto puestoUpdated = puestoService.updatePuesto(puestoActual); // Se llama al método que guarda el puesto actualizado

	        response.put("mensaje", "El puesto ha sido actualizado con éxito");
	        response.put("puesto", puestoUpdated); // Regresamos el puesto actualizado
	        return new ResponseEntity<Map<String, Object>>(response, HttpStatus.OK);
	        
	    } catch (DataAccessException e) {
	        response.put("mensaje", "Error al actualizar el puesto en la base de datos");
	        response.put("error", e.getMessage().concat(": ").concat(e.getMostSpecificCause().getMessage()));
	        return new ResponseEntity<Map<String, Object>>(response, HttpStatus.INTERNAL_SERVER_ERROR);
	    }
	}

}

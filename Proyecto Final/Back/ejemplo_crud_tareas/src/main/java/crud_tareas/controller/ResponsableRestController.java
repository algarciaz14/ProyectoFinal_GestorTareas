package crud_tareas.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import crud_tareas.dto.ResponsableDto;
import crud_tareas.entity.Responsable;
import crud_tareas.entity.Departamento;
import crud_tareas.entity.Puesto;
import crud_tareas.service.ResponsableService;

@CrossOrigin(origins = "http://localhost:4200")
@RestController
@RequestMapping("/api/responsables")
public class ResponsableRestController {

    @Autowired
    private ResponsableService responsableService;
    
  //Filtro por nombre 
  	@GetMapping("/filterByNombre")
  	public List<Responsable> filterByNombre(@RequestParam String nombre) {
  		return responsableService.findByNombre(nombre);
  	 }
  	
  //Filtro por Apellido
  	@GetMapping("/filterByApellido")
  	public List<Responsable> filterByApellido(@RequestParam String apellido) {
  		return responsableService.findByApellido(apellido);
  	 }
  	
  //Filtro por correo
  	@GetMapping("/filterByCorreo")
  	public List<Responsable> filterByCorreo(@RequestParam String correo) {
  		return responsableService.findByCorreo(correo);
  	 }
  	
  //Filtro por departamento
  	@GetMapping("/filterByDepartamento")
  	public List<Responsable> filterByDepartamento(@RequestParam String departamento) {
  		return responsableService.findByDepartamento(departamento);
  	 }
  	
  //Filtro por puesto
  	@GetMapping("/filterByPuesto")
  	public List<Responsable> filterByPuesto(@RequestParam String puesto) {
  		return responsableService.findByPuesto(puesto);
  	 }
  	
 

    //Crear un responsable
    @PostMapping("/create")
    public ResponseEntity<?> createResponsable(@RequestBody ResponsableDto responsableDto) {
        Map<String, Object> response = new HashMap<>();
        try {
            // Validaciones de campos obligatorios
            if (responsableDto.getNombre() == null || responsableDto.getNombre().isEmpty()) {
                response.put("mensaje", "El nombre del responsable es obligatorio");
                return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
            }
            if (responsableDto.getApellido() == null || responsableDto.getApellido().isEmpty()) {
                response.put("mensaje", "El apellido del responsable es obligatorio");
                return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
            }

            // Crear responsable
            Responsable nuevoResponsable = responsableService.createResponsable(responsableDto);
            response.put("mensaje", "Responsable creado con éxito");
            response.put("responsable", nuevoResponsable);
            return new ResponseEntity<>(response, HttpStatus.CREATED);
        } catch (DataAccessException e) {
            response.put("mensaje", "Error al realizar el insert en la base de datos");
            response.put("error", e.getMessage().concat(": ").concat(e.getMostSpecificCause().getMessage()));
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        } catch (Exception e) {
            response.put("mensaje", "Error inesperado al crear el responsable");
            response.put("error", e.getMessage());
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

  //Leer todos los responsables
    @GetMapping("")
    @ResponseStatus(HttpStatus.OK)
    public List<Responsable> consulta() {
        return responsableService.findAll();
    }
    
    
    //Obtener un responsable con id especifico 
    @GetMapping("/{id}")
    public ResponseEntity<?> consultaPorID(@PathVariable Long id) {
        Map<String, Object> response = new HashMap<>();
        try {
            Responsable responsable = responsableService.findById(id);
            if (responsable == null) {
                response.put("mensaje", "El responsable con el ID: " + id + " no existe en la base de datos.");
                return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
            }
            return new ResponseEntity<>(responsable, HttpStatus.OK);
        } catch (DataAccessException e) {
            response.put("mensaje", "Error al realizar la consulta.");
            response.put("error", e.getMessage().concat(": ").concat(e.getMostSpecificCause().toString()));
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

  //Eliminar el responsable del id especificado
    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        Map<String, Object> response = new HashMap<>();
        try {
            Responsable responsableDelete = responsableService.findById(id);
            if (responsableDelete == null) {
                response.put("mensaje", "Error al eliminar. El responsable no existe en la base de datos.");
                return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
            }
            responsableService.delete(id);
            response.put("mensaje", "Responsable eliminado con éxito");
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (DataAccessException e) {
            response.put("mensaje", "No se puede eliminar responsable, porque ya tiene una Tarea asignada");
            response.put("error", e.getMessage().concat(": ").concat(e.getMostSpecificCause().getLocalizedMessage()));
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    //Actualizar responsable
    @PutMapping("/{id}")
    public ResponseEntity<?> update(@RequestBody ResponsableDto responsableDto, @PathVariable Long id) {
        Map<String, Object> response = new HashMap<>();
        try {
            Responsable responsableActual = responsableService.findById(id);
            if (responsableActual == null) {
                response.put("mensaje", "Error: no se pudo editar, el responsable con ID " + id + " no existe en la base de datos.");
                return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
            }

            // Actualizamos solo los campos no nulos
            if (responsableDto.getNombre() != null) {
                responsableActual.setNombre(responsableDto.getNombre());
            }
            if (responsableDto.getApellido() != null) {
                responsableActual.setApellido(responsableDto.getApellido());
            }
            if (responsableDto.getCorreo() != null) {
                responsableActual.setCorreo(responsableDto.getCorreo());
            }
            if (responsableDto.getCelular() != null) {
                responsableActual.setCelular(responsableDto.getCelular());
            }

            // Validar y asignar departamento
            if (responsableDto.getDepartamento() != null) {
                Departamento departamento = responsableService.findDepartamentoById(responsableDto.getDepartamento().getId());
                if (departamento == null) {
                    response.put("mensaje", "El departamento con ID " + responsableDto.getDepartamento().getId() + " no existe.");
                    return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
                }
                responsableActual.setDepartamento(departamento);
            }

            // Validar y asignar puesto
            if (responsableDto.getPuesto() != null) {
                Puesto puesto = responsableService.findPuestoById(responsableDto.getPuesto().getId());
                if (puesto == null) {
                    response.put("mensaje", "El puesto con ID " + responsableDto.getPuesto().getId() + " no existe.");
                    return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
                }
                responsableActual.setPuesto(puesto);
            }

            // Guardar cambios
            Responsable responsableUpdated = responsableService.updateResponsable(responsableActual);
            response.put("mensaje", "El responsable ha sido actualizado con éxito");
            response.put("responsable", responsableUpdated);
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (DataAccessException e) {
            response.put("mensaje", "Error al actualizar el responsable en la base de datos");
            response.put("error", e.getMessage().concat(": ").concat(e.getMostSpecificCause().getMessage()));
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}


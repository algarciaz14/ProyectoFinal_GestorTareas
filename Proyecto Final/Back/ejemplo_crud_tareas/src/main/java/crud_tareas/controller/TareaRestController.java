
package crud_tareas.controller;

import java.time.LocalDateTime;
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

import crud_tareas.dto.TareaDto;
import crud_tareas.entity.Tarea;
import crud_tareas.service.TareaService;
import crud_tareas.entity.Responsable;
import crud_tareas.entity.Proyecto;
import crud_tareas.service.ProyectoService;
import crud_tareas.service.ResponsableService;

@CrossOrigin(origins= {"http://localhost:4200"})
@RestController
@RequestMapping("/api/tareas")
public class TareaRestController {

    @Autowired
    private TareaService tareaService;

    @Autowired
    private ProyectoService proyectoService;

    @Autowired
    private ResponsableService responsableService;
    
  //Filtro por nombre 
  	@GetMapping("/filterByNombre")
  	public List<Tarea> filterByNombre(@RequestParam String nombre) {
  		return tareaService.findByNombre(nombre);
  	 }
  	
  //Filtro por prioridad 
  	@GetMapping("/filterByPrioridad")
  	public List<Tarea> filterByPrioridad(@RequestParam String prioridad) {
  		return tareaService.findByPrioridad(prioridad);
  	 }
  	
  //Filtro por estado 
  	@GetMapping("/filterByEstado")
  	public List<Tarea> filterByEstado(@RequestParam String estado) {
  		return tareaService.findByEstado(estado);
  	 }
  	
  //Filtro por responsable 
  	@GetMapping("/filterByResponsable")
  	public List<Tarea> filterByResponsable(@RequestParam String responsable) {
  		return tareaService.findByResponsable(responsable);
  	 }
  	
  //Filtro por proyecto 
  	@GetMapping("/filterByProyecto")
  	public List<Tarea> filterByProyecto(@RequestParam String proyecto) {
  		return tareaService.findByProyecto(proyecto);
  	 }

   // Crear una nueva tarea
    @PostMapping("/create")
    public ResponseEntity<?> create(@RequestBody TareaDto tareaDto) {
        Map<String, Object> response = new HashMap<>();
        try {
            if (tareaDto.getCreateAtc() == null) {
                tareaDto.setCreateAtc(LocalDateTime.now().plusDays(7)); // Fecha de cierre por defecto
            }
            Tarea nuevaTarea = tareaService.createTarea(tareaDto);
            response.put("mensaje", "Tarea agregada con éxito, con el ID " + nuevaTarea.getId());
            response.put("tarea", nuevaTarea);
            return new ResponseEntity<>(response, HttpStatus.CREATED);
        } catch (DataAccessException e) {
            response.put("mensaje", "Error al realizar el insert");
            response.put("error", e.getMessage().concat(": ").concat(e.getMostSpecificCause().getMessage()));
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


   
  //Leer todas las tareas
    @GetMapping
    @ResponseStatus(HttpStatus.OK)
    public List<Tarea> consulta() {
        return tareaService.findAllWithResponsable();  
    }


    // Obtener una tarea por ID especifico
    @GetMapping("/{id}")
    public ResponseEntity<?> consultaPorID(@PathVariable Long id) {
        Map<String, Object> response = new HashMap<>();
        try {
            Tarea tarea = tareaService.findById(id);
            if (tarea == null) {
                response.put("mensaje", "La tarea con el ID ".concat(id.toString()).concat(" no existe en la base de datos"));
                return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
            }
            return new ResponseEntity<>(tarea, HttpStatus.OK);
        } catch (DataAccessException e) {
            response.put("mensaje", "Error al realizar la consulta");
            response.put("error", e.getMessage().concat(": ").concat(e.getMostSpecificCause().getMessage()));
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Eliminar una tarea por ID especifico
    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        Map<String, Object> response = new HashMap<>();
        try {
            Tarea tareaDelete = tareaService.findById(id);
            if (tareaDelete == null) {
                response.put("mensaje", "Error al eliminar. La tarea no existe en la base de datos");
                return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
            }
            tareaService.delete(id);
            response.put("mensaje", "Tarea eliminada con éxito");
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (DataAccessException e) {
            response.put("mensaje", "Error al eliminar en la base de datos");
            response.put("error", e.getMessage().concat(": ").concat(e.getMostSpecificCause().getMessage()));
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Actualizar una tarea existente
    @PutMapping("/{id}")
    public ResponseEntity<?> update(@RequestBody TareaDto tareaDto, @PathVariable Long id) {
        Map<String, Object> response = new HashMap<>();
        try {
            Tarea tareaActual = tareaService.findById(id);
            if (tareaActual == null) {
                response.put("mensaje", "Error: no se pudo editar, la tarea con ID ".concat(id.toString()).concat(" no existe en la base de datos."));
                return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
            }

            // Actualizamos los campos de la tarea actual
            if (tareaDto.getNombre() != null) tareaActual.setNombre(tareaDto.getNombre());
            if (tareaDto.getPrioridad() != null) tareaActual.setPrioridad(tareaDto.getPrioridad());
            if (tareaDto.getEstado() != null) tareaActual.setEstado(tareaDto.getEstado());

            // Asignamos el Proyecto basándonos en su ID
            if (tareaDto.getProyectoId() != null) {
                Proyecto proyecto = proyectoService.findById(tareaDto.getProyectoId());
                if (proyecto != null) {
                    tareaActual.setProyecto(proyecto);
                } else {
                    response.put("mensaje", "Error: el proyecto con ID ".concat(tareaDto.getProyectoId().toString()).concat(" no existe."));
                    return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
                }
            }

            // Asignamos el Responsable basándonos en su ID
            if (tareaDto.getResponsableId() != null) {
                Responsable responsable = responsableService.findById(tareaDto.getResponsableId());
                if (responsable != null) {
                    tareaActual.setResponsable(responsable);
                } else {
                    response.put("mensaje", "Error: el responsable con ID ".concat(tareaDto.getResponsableId().toString()).concat(" no existe."));
                    return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
                }
            }

            // Guardamos la tarea actualizada
            Tarea tareaUpdated = tareaService.updateTarea(tareaActual);
            response.put("mensaje", "La tarea ha sido actualizada con éxito");
            response.put("tarea", tareaUpdated);
            return new ResponseEntity<>(response, HttpStatus.OK);

        } catch (DataAccessException e) {
            response.put("mensaje", "Error al actualizar la tarea en la base de datos");
            response.put("error", e.getMessage().concat(": ").concat(e.getMostSpecificCause().getMessage()));
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}

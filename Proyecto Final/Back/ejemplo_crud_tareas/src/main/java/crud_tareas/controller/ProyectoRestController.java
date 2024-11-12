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

import crud_tareas.dto.ProyectoDto;
import crud_tareas.entity.Proyecto;
import crud_tareas.service.ProyectoService;

@CrossOrigin(origins = "http://localhost:4200")
@RestController
@RequestMapping("/api/proyectos") 
public class ProyectoRestController {

    @Autowired
    private ProyectoService proyectoService;

    @PostMapping("/create")
    public ResponseEntity<?> createProyecto(@RequestBody ProyectoDto proyectoDto) {
        Proyecto proyectoNuevo;
        Map<String, Object> response = new HashMap<>();

        try {
            proyectoNuevo = proyectoService.createProyecto(proyectoDto);
        } catch (DataAccessException e) {
            response.put("mensaje", "Error al realizar el insert en la base de datos");
            response.put("error", e.getMessage().concat(": ").concat(e.getMostSpecificCause().getMessage()));
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }

        response.put("mensaje", "Proyecto creado con éxito, con el ID " + proyectoNuevo.getId());
        response.put("proyecto", proyectoNuevo);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    // Leer todos los proyectos
    @GetMapping("")
    @ResponseStatus(HttpStatus.OK)
    public List<Proyecto> consulta() {
        return proyectoService.findAll();
    }

    // Obtener un proyecto con ID específico
    @GetMapping("/{id}")
    public ResponseEntity<?> consultaPorID(@PathVariable Long id) {
        Proyecto proyecto;
        try {
            proyecto = proyectoService.findById(id);
            if (proyecto == null) {
                return new ResponseEntity<>("El proyecto con ID " + id + " no existe en la base de datos.", HttpStatus.NOT_FOUND);
            }
            return new ResponseEntity<>(proyecto, HttpStatus.OK);
        } catch (DataAccessException e) {
            return new ResponseEntity<>("Error al realizar la consulta: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Eliminar un proyecto con ID específico
    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        Map<String, Object> response = new HashMap<>();
        try {
            Proyecto proyectoDelete = proyectoService.findById(id);
            if (proyectoDelete == null) {
                response.put("mensaje", "Error al eliminar. El proyecto no existe en la base de datos");
                return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
            }
            proyectoService.delete(id);
            response.put("mensaje", "Proyecto eliminado con éxito");
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (DataAccessException e) {
            response.put("mensaje", "Error al eliminar en la base de datos");
            response.put("error", e.getMessage());
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Actualizar un proyecto existente
    @PutMapping("/{id}")
    public ResponseEntity<?> update(@RequestBody ProyectoDto proyectoDto, @PathVariable Long id) {
        Map<String, Object> response = new HashMap<>();
        try {
            Proyecto proyectoActual = proyectoService.findById(id);
            if (proyectoActual == null) {
                response.put("mensaje", "Error: el proyecto con ID " + id + " no existe en la base de datos.");
                return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
            }

            if (proyectoDto.getNombre() != null) {
                proyectoActual.setNombre(proyectoDto.getNombre());
            }
            if (proyectoDto.getDescripcion() != null) {
                proyectoActual.setDescripcion(proyectoDto.getDescripcion());
            }

            Proyecto proyectoUpdated = proyectoService.updateProyecto(proyectoActual);
            response.put("mensaje", "El proyecto ha sido actualizado con éxito");
            response.put("proyecto", proyectoUpdated);
            return new ResponseEntity<>(response, HttpStatus.OK);

        } catch (DataAccessException e) {
            response.put("mensaje", "Error al actualizar el proyecto en la base de datos");
            response.put("error", e.getMessage());
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}

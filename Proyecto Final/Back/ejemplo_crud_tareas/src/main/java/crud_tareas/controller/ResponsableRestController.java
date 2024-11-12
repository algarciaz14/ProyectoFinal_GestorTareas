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
import crud_tareas.entity.Puesto;
import crud_tareas.entity.Departamento;
import crud_tareas.service.ResponsableService;
import crud_tareas.service.PuestoService;
import crud_tareas.service.DepartamentoService;

@CrossOrigin(origins = "http://localhost:4200")
@RestController
@RequestMapping("/api/responsables")
public class ResponsableRestController {

    @Autowired
    private ResponsableService responsableService;

    @Autowired
    private PuestoService puestoService;

    @Autowired
    private DepartamentoService departamentoService;

    @PostMapping("/create")
    public ResponseEntity<?> createResponsable(@RequestBody ResponsableDto responsableDto) {
        Map<String, Object> response = new HashMap<>();
        Responsable nuevoResponsable;

        try {
            nuevoResponsable = responsableService.createResponsable(responsableDto);
            response.put("mensaje", "Responsable creado con éxito, con el ID " + nuevoResponsable.getId());
            response.put("responsable", nuevoResponsable);
            return new ResponseEntity<>(response, HttpStatus.CREATED);
        } catch (DataAccessException e) {
            response.put("mensaje", "Error al realizar el insert en la base de datos");
            response.put("error", e.getMessage().concat(": ").concat(e.getMostSpecificCause().getMessage()));
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Leer todos los responsables
    @GetMapping("")
    @ResponseStatus(HttpStatus.OK)
    public List<Responsable> consulta() {
        return responsableService.findAll();
    }

    // Obtener un responsable con ID específico
    @GetMapping("/{id}")
    public ResponseEntity<?> consultaPorID(@PathVariable Long id) {
        Responsable responsable;
        Map<String, Object> response = new HashMap<>();

        try {
            responsable = responsableService.findById(id);
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

    // Eliminar al responsable del ID especificado
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
            response.put("mensaje", "Error al eliminar en la base de datos");
            response.put("error", e.getMessage().concat(": ").concat(e.getMostSpecificCause().getLocalizedMessage()));
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Actualizar Responsable
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

            // Asignamos Departamento y Puesto si existen
            if (responsableDto.getDepartamento() != null) {
                Departamento departamento = departamentoService.findById(responsableDto.getDepartamento());
                if (departamento != null) {
                    responsableActual.setDepartamento(departamento);
                } else {
                    response.put("mensaje", "Error: el departamento con ID " + responsableDto.getDepartamento() + " no existe.");
                    return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
                }
            }

            if (responsableDto.getPuesto() != null) {
                Puesto puesto = puestoService.findById(responsableDto.getPuesto());
                if (puesto != null) {
                    responsableActual.setPuesto(puesto);
                } else {
                    response.put("mensaje", "Error: el puesto con ID " + responsableDto.getPuesto() + " no existe.");
                    return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
                }
            }

            // Guardamos el responsable actualizado
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

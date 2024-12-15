package crud_tareas.repository;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;


import crud_tareas.entity.Tarea;


public interface ITareaRepository extends JpaRepository <Tarea, Long>{
	@Query("SELECT t FROM Tarea t JOIN FETCH t.responsable")
	List<Tarea> findAllWithResponsable();
	
	@Query("SELECT d FROM Tarea d WHERE LOWER(d.nombre) LIKE LOWER(CONCAT('%', :nombre, '%'))")
    List<Tarea> findByNombreContaining(@Param("nombre") String nombre);
	
	@Query("SELECT d FROM Tarea d WHERE LOWER(d.prioridad) LIKE LOWER(CONCAT('%', :prioridad, '%'))")
    List<Tarea> findByPrioridadContaining(@Param("prioridad") String prioridad); 
	
	@Query("SELECT d FROM Tarea d WHERE LOWER(d.estado) LIKE LOWER(CONCAT('%', :estado, '%'))")
    List<Tarea> findByEstadoContaining(@Param("estado") String estado); 
	
	@Query("SELECT d FROM Tarea d WHERE d.responsable IS NOT NULL AND LOWER(d.responsable.nombre) LIKE LOWER(CONCAT('%', :responsable, '%'))")
	List<Tarea> findByResponsableContaining(@Param("responsable") String responsable);

	@Query("SELECT d FROM Tarea d WHERE d.proyecto IS NOT NULL AND LOWER(d.proyecto.nombre) LIKE LOWER(CONCAT('%', :proyecto, '%'))")
	List<Tarea> findByProyectoContaining(@Param("proyecto") String proyecto);


}

package crud_tareas.repository;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import crud_tareas.entity.Tarea;


public interface ITareaRepository extends JpaRepository <Tarea, Long>{
	@Query("SELECT t FROM Tarea t JOIN FETCH t.responsable")
	List<Tarea> findAllWithResponsable();


}

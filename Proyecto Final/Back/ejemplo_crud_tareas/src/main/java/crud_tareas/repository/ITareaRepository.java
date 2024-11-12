package crud_tareas.repository;
import org.springframework.data.jpa.repository.JpaRepository;
import crud_tareas.entity.Tarea;


public interface ITareaRepository extends JpaRepository <Tarea, Long>{

}

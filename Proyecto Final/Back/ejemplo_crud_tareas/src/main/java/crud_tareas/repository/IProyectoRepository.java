package crud_tareas.repository;
import org.springframework.data.jpa.repository.JpaRepository;
import crud_tareas.entity.Proyecto;


public interface IProyectoRepository extends JpaRepository <Proyecto, Long>{

}

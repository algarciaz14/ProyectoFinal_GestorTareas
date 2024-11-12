package crud_tareas.repository;
import org.springframework.data.jpa.repository.JpaRepository;
import crud_tareas.entity.Responsable;


public interface IResponsableRepository extends JpaRepository <Responsable, Long>{

}

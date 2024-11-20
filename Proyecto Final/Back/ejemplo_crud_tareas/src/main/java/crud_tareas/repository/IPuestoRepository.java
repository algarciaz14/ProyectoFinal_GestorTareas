package crud_tareas.repository;
import org.springframework.data.jpa.repository.JpaRepository;
import crud_tareas.entity.Puesto;


public interface IPuestoRepository extends JpaRepository <Puesto, Long>{

}

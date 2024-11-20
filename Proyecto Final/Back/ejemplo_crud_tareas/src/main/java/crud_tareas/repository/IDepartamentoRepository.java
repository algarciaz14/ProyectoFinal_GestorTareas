package crud_tareas.repository;
import org.springframework.data.jpa.repository.JpaRepository;
import crud_tareas.entity.Departamento;


public interface IDepartamentoRepository extends JpaRepository <Departamento, Long>{

}

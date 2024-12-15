package crud_tareas.repository;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import crud_tareas.entity.Departamento;


public interface IDepartamentoRepository extends JpaRepository <Departamento, Long>{

	@Query("SELECT d FROM Departamento d WHERE LOWER(d.nombre) LIKE LOWER(CONCAT('%', :nombre, '%'))")
    List<Departamento> findByNombreContaining(@Param("nombre") String nombre);
}
   
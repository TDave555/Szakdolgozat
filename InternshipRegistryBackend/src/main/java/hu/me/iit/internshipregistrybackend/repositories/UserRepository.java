package hu.me.iit.internshipregistrybackend.repositories;

import hu.me.iit.internshipregistrybackend.entities.User;
import hu.me.iit.internshipregistrybackend.enums.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);
    boolean existsByUsername(String username);

    @Modifying
    @Query("UPDATE User u SET u.username = :username WHERE u.id = :id")
    int updateUsername(@Param("id") Long id, @Param("username") String username);

    @Modifying
    @Query("UPDATE User u SET u.role = :role WHERE u.id = :id")
    int updateRole(@Param("id") Long id, @Param("role") Role role);

    @Modifying
    @Query("UPDATE User u SET u.password = :password WHERE u.id = :id")
    int updatePassword(@Param("id") Long id, @Param("password") String password);
}

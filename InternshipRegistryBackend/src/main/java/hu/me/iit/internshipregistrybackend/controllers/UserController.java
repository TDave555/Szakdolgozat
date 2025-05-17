package hu.me.iit.internshipregistrybackend.controllers;

import hu.me.iit.internshipregistrybackend.dtos.create_update.CreateUserDto;
import hu.me.iit.internshipregistrybackend.dtos.create_update.UpdateUserPasswordDto;
import hu.me.iit.internshipregistrybackend.dtos.read.UserDto;
import hu.me.iit.internshipregistrybackend.dtos.create_update.UpdateUserDto;
import hu.me.iit.internshipregistrybackend.services.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("admin/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping
    public ResponseEntity<List<UserDto>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    @GetMapping("/{username}")
    public ResponseEntity<UserDto> getUserByUsername(@PathVariable String username) {
        return ResponseEntity.ok(userService.getUserByUsername(username));
    }

    @PatchMapping("/{username}/username")
    public ResponseEntity<UserDto> updateUsername(@PathVariable String username, @Valid @RequestBody UpdateUserDto userDto) {
        return ResponseEntity.ok(userService.updateUsername(username, userDto));
    }

    @PatchMapping("/{username}/password")
    public ResponseEntity<UserDto> updateUserPass(@PathVariable String username, @Valid @RequestBody UpdateUserPasswordDto passwordDto) {
        return ResponseEntity.ok(userService.updatePassword(username, passwordDto));
    }

    @PatchMapping("/{username}/username")
    public ResponseEntity<UserDto> updateUserRole(@PathVariable String username, @Valid @RequestBody UpdateUserDto userDto) {
        return ResponseEntity.ok(userService.updateRole(username, userDto));
    }

    @PostMapping
    public ResponseEntity<UserDto> createUser(@Valid @RequestBody CreateUserDto userDto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(userService.createUser(userDto));
    }

    @DeleteMapping("/{username}")
    public ResponseEntity<Void> deleteUserByUsername(@PathVariable String username) {
        userService.deleteUser(username);
        return ResponseEntity.noContent().build();
    }
}

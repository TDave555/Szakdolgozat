package hu.me.iit.internshipregistrybackend.controllers;

import hu.me.iit.internshipregistrybackend.dtos.read.UserDto;
import hu.me.iit.internshipregistrybackend.dtos.update.UpdateUserDto;
import hu.me.iit.internshipregistrybackend.dtos.update.UpdateUserPasswordDto;
import hu.me.iit.internshipregistrybackend.services.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

@RestController
@RequestMapping("/users/me")
@RequiredArgsConstructor
public class UserSelfController {
    private final UserService userService;

    @GetMapping
    public ResponseEntity<UserDto> getOwnDetails(Principal principal) {
        return ResponseEntity.ok(userService.getUserByUsername(principal.getName()));
    }

    @PatchMapping("/username")
    public ResponseEntity<UserDto> updateUsername(@RequestBody @Valid UpdateUserDto userDto, Principal principal) {
        return ResponseEntity.ok(userService.updateUsername(principal.getName(), userDto.getUsername()));
    }

    @PatchMapping("/password")
    public ResponseEntity<UserDto> updatePassword(@RequestBody @Valid UpdateUserPasswordDto passwordDto, Principal principal) {
        return ResponseEntity.ok(userService.updatePassword(principal.getName(), passwordDto.getPassword()));
    }

}

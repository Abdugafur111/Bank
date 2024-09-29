package com.Group2.BankBuddy.config;
import com.auth0.jwt.interfaces.Claim;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

import com.Group2.BankBuddy.Entity.Person;
import com.Group2.BankBuddy.dtos.PersonDto;
import com.Group2.BankBuddy.repositories.PersonRepository;
import com.Group2.BankBuddy.services.PersonService;
import com.auth0.jwt.JWT;
import com.auth0.jwt.JWTVerifier;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.interfaces.DecodedJWT;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.AuthorityUtils;
import org.springframework.stereotype.Component;

import java.util.*;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class UserAuthenticationProvider {

    @Value("${security.jwt.token.secret-key:secret-key}")
    private String secretKey;

    private final PersonService personService;
    private final PersonRepository personRepository;

    @PostConstruct
    protected void init() {
        // This is to avoid having the raw secret key available in the JVM
        secretKey = Base64.getEncoder().encodeToString(secretKey.getBytes());
    }

    public String createToken(String email) {
        Date now = new Date();
        Date validity = new Date(now.getTime() + 3600000); // 1 hour
        Algorithm algorithm = Algorithm.HMAC256(secretKey);

        Optional<Person> personOptional = personRepository.findByEmail(email);

        if (personOptional.isPresent()) {
            Person person = personOptional.get();
            String role = person.getRole();
            System.out.println(role);
            return JWT.create()
                    .withSubject(email)
                    .withClaim("role", role)
                    .withIssuedAt(now)
                    .withExpiresAt(validity)
                    .sign(algorithm);
        } else {
            return "Person doesn't exist";
        }
    }

    public Authentication validateToken(String token) {
        Algorithm algorithm = Algorithm.HMAC256(secretKey);

        JWTVerifier verifier = JWT.require(algorithm)
                .build();

        DecodedJWT decoded = verifier.verify(token);

        PersonDto personDto = personService.findByEmail(decoded.getSubject());

        String role = extractRole(decoded);

        Collection<? extends GrantedAuthority> authorities;

        if (role != null) {
            authorities = Collections.singletonList(new SimpleGrantedAuthority(role));

        } else {
            authorities = Collections.emptyList();
        }

        return new UsernamePasswordAuthenticationToken(personDto, null, authorities);
    }


    private String extractRole(DecodedJWT decodedJWT) {
        Claim rolesClaim = decodedJWT.getClaim("role");

        if (rolesClaim.isNull()) {
            return null;
        }

        // Include "ROLE_" prefix
        return "ROLE_" + rolesClaim.asString();
    }
}

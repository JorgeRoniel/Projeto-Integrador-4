package com.ufc.APIlibrary.domain.Book;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "books_tb")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class Book {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private String author;

    private String publisher;

    private String edition;

    private Integer date_publication;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(
            name = "books_categories",
            joinColumns = @JoinColumn(name = "id")
    )
    @Column(name = "genero")
    private List<String> categories = new ArrayList<>();

    @Column(length = 255)
    private String description;

    @Column(name = "preview_picture")
    private byte[] preview_picture;

    /* Campos derivados de avaliações */
    private Integer sum_ratings = 0;
    private Integer reviews_count = 0;
    private Float rating_avg = 0f;

    private LocalDate acquision_date;
}

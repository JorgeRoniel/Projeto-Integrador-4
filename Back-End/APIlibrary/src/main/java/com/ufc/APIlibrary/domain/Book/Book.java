package com.ufc.APIlibrary.domain.Book;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
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

    private Integer id;
    private String title;
    private String author;
    private String publisher;
    private String edition;
    private Integer date_publication;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(
            name = "book_categories",
            joinColumns = @JoinColumn(name = "id")
    )

    private List<String> categories = new ArrayList<>();


    private String description;
    private byte[] preview_picture;
    private Integer sum_ratings = 0;
    private Integer reviews_count = 0;
    private Float rating_avg = 0f;
    private LocalDate acquision_date;

    public Book(String title, String author, String publisher, String edition, Integer date_publication, List<String> categories, String description, byte[] preview_picture) {
        this.title = title;
        this.author = author;
        this.publisher = publisher;
        this.edition = edition;
        this.date_publication = date_publication;
        this.categories = categories;
        this.description = description;
        this.preview_picture = preview_picture;
        this.acquision_date = LocalDate.now();
    }
}

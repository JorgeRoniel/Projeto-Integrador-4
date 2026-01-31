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

    private Integer id;
    private String title;
    private String author;
    private String publisher;
    private String edition;
    private Integer date_publication;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "book_categories", joinColumns = @JoinColumn(name = "id"))

    private List<String> category = new ArrayList<>();

    private String description;
    private byte[] preview_picture;
    private String preview_picture_url;
    private Integer sum_ratings = 0;
    private Integer reviews_count = 0;
    private Float rating_avg = 0f;
    private LocalDate acquision_date = LocalDate.now();

    private Integer count_in_wishlist = 0;
    private Integer count_reading = 0; 
    private Integer count_read = 0;
    private Float popularity_score = 0f;

    public void updatePopularity(long totalUsers) {
        if (totalUsers == 0) {
            this.popularity_score = 0f;
            return;
        }
        float totalInteractions = count_in_wishlist + count_reading + count_read;
        this.popularity_score = (totalInteractions / totalUsers) * 100;
    }

    public Book(String title, String author, String publisher, String edition, Integer date_publication,
            List<String> categories, String description, byte[] preview_picture, String preview_picture_url, LocalDate acquision_date) {
        this.title = title;
        this.author = author;
        this.publisher = publisher;
        this.edition = edition;
        this.date_publication = date_publication;
        this.category = categories;
        this.description = description;
        this.preview_picture = preview_picture;
        this.preview_picture_url = preview_picture_url; 
        this.acquision_date = acquision_date;
    
        this.sum_ratings = 0;
        this.reviews_count = 0;
        this.rating_avg = 0f;
        this.count_in_wishlist = 0;
        this.count_reading = 0;
        this.count_read = 0;
        this.popularity_score = 0f;
    }
}

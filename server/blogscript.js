const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const pool = require("./database");

// Function to read CSV and insert data
const insertExercises = async () => {
  const exercises = [];

  fs.createReadStream('exercises.csv')
    .pipe(csv())
    .on('data', (row) => {
      exercises.push(row);
    })  
    .on('end', async () => {
      console.log('CSV file successfully processed');

      for (const exercise of exercises) {
        const { ex_title, ex_description, ex_pic } = exercise;

        if (!ex_pic) {
          console.error('Error: Missing ex_pic in CSV row');
          continue; // Skip this row and proceed to the next one
        }

        // Read image file as binary
        let image;
        try {
          const imagePath = path.resolve(__dirname, ex_pic);
          if (!fs.existsSync(imagePath)) {
            console.error(`Error: Image file ${ex_pic} does not exist`);
            continue; // Skip this row if the image file does not exist
          }
          image = fs.readFileSync(imagePath);
        } catch (error) {
          console.error(`Error reading image file ${ex_pic}:`, error);
          continue; // Skip this row if there's an error with the image file
        }

        try {
          const result = await pool.query(
            'INSERT INTO exercise (ex_pic, ex_title, ex_description) VALUES ($1, $2, $3) RETURNING *',
            [image, ex_title, ex_description]
          );
          console.log(`Inserted exercise with ID: ${result.rows[0].ex_id}`);
        } catch (error) {
          console.error('Error inserting exercise:', error);
        }
      }

      pool.end();
    });
};

insertExercises();

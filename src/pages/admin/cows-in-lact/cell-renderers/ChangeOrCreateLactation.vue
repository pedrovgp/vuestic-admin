<script>
  export default {
    name: 'ChangeOrCreateLactation',
    data() {
      return {
        lactationData: {
          date: '',
          amount: 0,
        },
      }
    },
    methods: {
      async submitLactation() {
        // Logic to create or update lactation record
        // This could involve checking if a record exists for the given date
        // and then deciding to create a new record or update the existing one.
        console.log('Submitting lactation data:', this.lactationData)

        // Check if the lactationData.date is empty
        if (this.lactationData.date === '') {
          // If it's empty, it means the user wants to create a new lactation
          // Set the start date to the default value passed through the arguments
          this.lactationData.date = this.defaultStartDate
          // Example: this.createLactation(this.lactationData);
        } else {
          // If the lactationData.date is not empty, it means the user wants to close a lactation
          // Fetch the current open lactation record and pre-fill the close date with today's date
          const openLactation = await this.fetchOpenLactation()
          if (openLactation) {
            this.lactationData.date = new Date().toISOString().split('T')[0]
            // Example: this.closeLactation(openLactation, this.lactationData);
          } else {
            console.log('No open lactation found')
          }
        }
      },
      // You might want to add the createLactation, fetchOpenLactation, and closeLactation methods or similar here
    },
    props: {
      defaultStartDate: {
        type: String,
        default: '',
      },
    },
  }
</script>

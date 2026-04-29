# Ethiopian Liturgical Data Engine

The Ethiopian Liturgical Data Engine is a robust, production-ready system designed to compute the Ethiopian church year and serve structured liturgical data for Christian worship applications. Originally conceived as a mathematical research project to understand the traditional Ethiopian computus, it has evolved into a comprehensive web platform and data foundation specifically tailored for the Ethiopian Evangelical Church Mekane Yesus (EECMY).

Computing the Ethiopian liturgical calendar goes far beyond standard date formatting. It requires a precise programmatic implementation of the Bahire Hasab system, the ancient Alexandrian computus that dictates the shifting dates of Tinsae (Easter) and all subsequent movable feasts. This engine executes that complex lunar arithmetic, anchoring the entire liturgical year to the Fast of Nineveh and accurately projecting the calendar across any given Ethiopian year.

A major milestone of this project is its full integration with the official EECMY lectionary. The system maps out the entire three-year lectionary cycle corresponding to the Years of Matthew, Mark, and Luke, alongside the unique Year of John. For every Sunday, fast, and major holy day, the engine provides the exact scriptural readings, established sermon themes, and appropriate liturgical colors. This rich dataset transforms the engine into an invaluable resource for pastors planning services, worship leaders coordinating liturgy, and developers building Ethiopian Christian software.

The accompanying Next.js web application serves as both a mathematical validation tool and an interactive dashboard. Visitors can seamlessly convert dates between the Gregorian and Ethiopian calendars in real-time, instantly discovering the specific liturgical context and historical Evangelist year for any given day. The platform also offers a transparent view into the inner workings of the Bahire Hasab algorithm itself, allowing users to trace the exact mathematical steps used to determine feast dates. 

A dedicated observance library allows users to explore the entirety of the EECMY lectionary. The interface is highly polished, featuring dynamic feast timelines and seasonal color coordination that adapts flawlessly to both light and dark display modes. Every component has been designed with readability and professional aesthetics in mind, ensuring a premium experience.

The foundational Bahire Hasab algorithm was carefully ported into TypeScript, cross-referenced, and validated against established open-source implementations to guarantee absolute mathematical accuracy. The core principle of the algorithm remains elegant and unbroken: every movable observance is fixed at a specific day offset from the Fast of Nineveh, which is derived from precise lunar constants.

This project has now reached a feature-complete and stable state. The computational engine, the integrated lectionary dataset, and the responsive user interface are entirely production-ready. Developers are encouraged to explore the codebase, where they can easily extract the underlying JSON datasets or standalone TypeScript modules to power their own mobile or web applications. 

To run the project locally, simply clone the repository, install the dependencies via npm install, and run npm run dev to start the development server. The architecture clearly separates the core mathematical engine from the React frontend, making it straightforward to navigate, adapt, or extend.

## Credits

The core Bahire Hasab algorithm implementation was adapted from the open-source Kenat project by Henok Mikre. We remain deeply respectful of the original computus tradition of the Ethiopian Orthodox Tewahedo Church, from which this profound mathematical framework originates.

Vibe-coding SDK:


Module files:

context-for-code-agent.md
current-plan.md
third-parties-docs/
data-model-schema.md
deployment-commands.md
In the case of backend:
services/*/Readme.md

Context File Template:

- Project Overview.
- Project Modules.
- Modules Overviews.
- Project Architechture (Flow).
- Modules:
    - Readme.md
        - Module Overview.
        - Building and running.
        - Prerequisites.
        - Local Development.
        - Testing.
        - Development conventions.
            - Language.
            - Linting.
            - Formatting.
            - Testing.
            - Api Documentation.
            - CI/CD:
                - Github actions. 
                - Deployment command that have worked for us. 
    - Module Structure (Directories and files).
    - Module Files:
        - File purpose. 
        - Recent changes. 
    - Next steps.	


Current Plan Template:

- Plan Summary.
- Plan Architechture. (Flow).
- Plan Structure. (Directories and files).
- Modifications (in phases and steps):
    - Phase #/ Step #:
        - In-directory location to be modified.
        - In-file/script location to be modified.
        - Specification of what should not be modified 
        - Code ready to copy/paste.
        - Explanation of code and what it will do for us.
    - Testing phase:
        - Local Test.
        - Integration Test.
- Update Readme in the specific service in case of backend. 

Please read all the codebase and documents in 30X except the chat-agent-api, and update this module (investor-match-backend) so it matches this template. Fill the appropiate directories and files with all the information available with this format.
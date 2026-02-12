
        let instructionCount = 1;

        function addInstruction() {
            const instructionsDiv = document.getElementById('instructions');
            const newInstructionDiv = document.createElement('div');
            newInstructionDiv.classList.add('input-group', 'mb-3');
            newInstructionDiv.innerHTML = `
                <input type="file" name="instructions[${instructionCount}][file]" class="form-control">
                <input type="text" name="instructions[${instructionCount}][file_name]" class="form-control mt-2" placeholder="Anna failile nimi">
                <button type="button" class="btn btn-danger mt-2" onclick="removeInstruction(this)">Eemalda</button>
                
            `;



            instructionsDiv.appendChild(newInstructionDiv)

            instructionCount++;
            
        }


        function removeInstruction(button) {
            const instructionDiv = button.parentElement;
            instructionDiv.remove();
        }


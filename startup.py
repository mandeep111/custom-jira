import os
import subprocess

# os.environ["JAVA_HOME"] = "C:\Program Files\Java\jdk-17"
# os.environ["MAVEN_HOME"] = "C:\maven"

def load_env_variables(file_path):
    with open(file_path, 'r') as file:
        lines = file.readlines()
        for line in lines:
            variables = line.strip().split(';')
            for variable in variables:
                key_value = variable.strip().split('=')
                if len(key_value) == 2:
                    key, value = key_value
                    os.environ[key] = value
                    print(key + '=' + value)


def compile_and_run(project_location, app_name, env_filename):
    try:
        os.chdir(project_location)
        if env_filename != '':
            env_file_path = os.path.join(project_location, env_filename)
            load_env_variables(env_file_path)
        else:
            os.environ["profile"] = "development"
        # subprocess.run(['mvn', 'clean', 'install'])
        # Set the title of the Command Prompt window
        title = "Your Custom Title"
        subprocess.run(f'title {title}', shell=True, check=True)
        subprocess.run(f'mvnw clean package -DskipTests -P{os.environ["profile"]}', shell=True, check=True)
        subprocess.run(['cls'], shell=True, check=True)
        subprocess.run(['java', '-jar', 'target/'+app_name+'.jar'])

    except Exception as e:
        print(f"An error occurred: {str(e)}")

if __name__ == "__main__":
    custom_jar = input("Do you want to use a .jar that isn't app.jar? (y/N): ").strip().lower()
    app_name = 'app'
    if custom_jar == 'y':
        app_name = input("Enter jar file name excluding (.jar): ")
    use_env = input("Do you want to use environment variables for your project? (Y/n): ").strip().lower()
    env_filename = '.env'
    project_location = ''
    if use_env == 'n':
        env_filename = ''

    choice = input("Do you want to use the current directory as the project location? (Y/n): ").strip().lower()
    if choice == 'n':
        project_location = input("Enter the project location: ").strip()
    else:
        project_location = os.path.dirname(os.path.abspath(__file__))
        print("Using the current directory:", project_location)
    compile_and_run(project_location, app_name, env_filename)